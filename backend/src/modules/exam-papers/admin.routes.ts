import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/admin.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const STATUSES = ['draft', 'published', 'live', 'ended', 'archived'];

async function writeAudit(req: any, action: string, targetId?: string, targetType = 'ExamPaper') {
  try {
    await prisma.auditLog.create({
      data: { actorId: req.user.id, actorName: req.user.name, action, targetType, targetId: targetId ?? null },
    });
  } catch { /* non-fatal */ }
}

const isNotFound = (e: any) => e?.code === 'P2025';

const text = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

function int(v: unknown, min: number, max: number): number | undefined | 'bad' {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n >= min && n <= max ? n : 'bad';
}

/** Only these fields can ever be written to a paper (no id, createdAt, relations...). */
function parsePaper(body: any, requireAll: boolean): { data?: Record<string, unknown>; error?: string } {
  const b = body || {};
  const data: Record<string, unknown> = {};

  for (const [key, max] of [['title', 200], ['classLevel', 20], ['paper', 40], ['board', 60]] as const) {
    if (b[key] !== undefined) {
      const t = text(b[key], max);
      if (!t) return { error: `${key} must be a non-empty string` };
      data[key] = t;
    } else if (requireAll) {
      return { error: 'title, classLevel, paper, board are required' };
    }
  }

  if (b.instructions !== undefined) data.instructions = text(b.instructions, 5000) ?? null;

  if (b.year !== undefined) {
    if (b.year === null || b.year === '') data.year = null;
    else { const y = int(b.year, 1990, 2100); if (y === 'bad') return { error: 'year must be 1990-2100' }; data.year = y; }
  }
  for (const [key, min, max, label] of [['durationMins', 1, 600, 'durationMins must be 1-600'], ['totalMarks', 1, 1000, 'totalMarks must be 1-1000']] as const) {
    if (b[key] !== undefined) {
      const n = int(b[key], min, max);
      if (n === 'bad' || n === undefined) return { error: label };
      data[key] = n;
    }
  }
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status)) return { error: `status must be one of: ${STATUSES.join(', ')}` };
    data.status = b.status;
  }
  return { data };
}

router.get('/', async (_req, res, next) => {
  try {
    const papers = await prisma.examPaper.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sections: { orderBy: { orderIndex: 'asc' }, include: { questions: { orderBy: { orderIndex: 'asc' } } } },
        _count: { select: { attempts: true } },
      },
    });
    res.json(papers.map((p) => ({ ...p, attemptsCount: p._count?.attempts ?? 0 })));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { data, error } = parsePaper(req.body, true);
    if (error || !data) return res.status(400).json({ error });
    const created = await prisma.examPaper.create({
      data: {
        ...(data as any),
        durationMins: (data.durationMins as number) ?? 180,
        totalMarks: (data.totalMarks as number) ?? 100,
        status: (data.status as string) ?? 'draft',
        year: (data.year as number | null | undefined) ?? null,
        instructions: (data.instructions as string | null | undefined) ?? null,
      },
    });
    await writeAudit(req, 'examPaper.create', created.id);
    res.json(created);
  } catch (err) { next(err); }
});

router.patch('/:id/launch', async (req, res, next) => {
  try {
    const updated = await prisma.examPaper.update({
      where: { id: req.params.id },
      data: { status: 'live', launchedAt: new Date(), endedAt: null },
    });
    await writeAudit(req, 'examPaper.launch', updated.id);
    res.json(updated);
  } catch (err) { isNotFound(err) ? res.status(404).json({ error: 'Paper not found' }) : next(err); }
});

router.patch('/:id/end', async (req, res, next) => {
  try {
    const updated = await prisma.examPaper.update({
      where: { id: req.params.id },
      data: { status: 'ended', endedAt: new Date() },
    });
    await writeAudit(req, 'examPaper.end', updated.id);
    res.json(updated);
  } catch (err) { isNotFound(err) ? res.status(404).json({ error: 'Paper not found' }) : next(err); }
});

router.get('/:id/attempts', async (req, res, next) => {
  try {
    const rows = await prisma.examPaperAttempt.findMany({
      where: { paperId: req.params.id }, orderBy: { startedAt: 'desc' }, take: 500,
    });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/:paperId/sections', async (req, res, next) => {
  try {
    const name = text(req.body?.name, 120);
    if (!name) return res.status(400).json({ error: 'Section name required' });
    const marks = int(req.body?.marks ?? 0, 0, 1000);
    if (marks === 'bad') return res.status(400).json({ error: 'marks must be 0-1000' });

    const paper = await prisma.examPaper.findUnique({ where: { id: req.params.paperId }, select: { id: true } });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });

    const orderIndex = await prisma.examPaperSection.count({ where: { paperId: paper.id } });
    const section = await prisma.examPaperSection.create({
      data: { paperId: paper.id, name, marks: marks ?? 0, instructions: text(req.body?.instructions, 3000) ?? null, orderIndex },
    });
    await writeAudit(req, 'examPaper.section.create', section.id, 'ExamPaperSection');
    res.json(section);
  } catch (err) { next(err); }
});

router.post('/:paperId/sections/:sectionId/questions', async (req, res, next) => {
  try {
    const prompt = text(req.body?.prompt, 2000);
    const answer = text(req.body?.answer, 300);
    const options = Array.isArray(req.body?.options)
      ? req.body.options.map((o: unknown) => text(o, 300)).filter((o: string | undefined): o is string => !!o)
      : [];
    if (!prompt || !answer || options.length < 2 || options.length > 8) {
      return res.status(400).json({ error: 'prompt, options (2-8) and answer are required' });
    }
    if (!options.includes(answer)) return res.status(400).json({ error: 'answer must be one of the options' });
    const marks = int(req.body?.marks ?? 1, 1, 100);
    if (marks === 'bad') return res.status(400).json({ error: 'marks must be 1-100' });

    const section = await prisma.examPaperSection.findFirst({
      where: { id: req.params.sectionId, paperId: req.params.paperId }, select: { id: true },
    });
    if (!section) return res.status(404).json({ error: 'Section not found in this paper' });

    const orderIndex = await prisma.examPaperQuestion.count({ where: { sectionId: section.id } });
    const question = await prisma.examPaperQuestion.create({
      data: {
        sectionId: section.id, prompt, options, answer, marks: marks ?? 1,
        explanation: text(req.body?.explanation, 3000) ?? null, orderIndex,
      },
    });
    await writeAudit(req, 'examPaper.question.create', question.id, 'ExamPaperQuestion');
    res.json(question);
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { data, error } = parsePaper(req.body, false);
    if (error || !data) return res.status(400).json({ error });
    if (!Object.keys(data).length) return res.status(400).json({ error: 'Nothing to update' });
    const updated = await prisma.examPaper.update({ where: { id: req.params.id }, data: data as any });
    await writeAudit(req, 'examPaper.update', updated.id);
    res.json(updated);
  } catch (err) { isNotFound(err) ? res.status(404).json({ error: 'Paper not found' }) : next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.examPaper.delete({ where: { id: req.params.id } });
    await writeAudit(req, 'examPaper.delete', req.params.id);
    res.json({ ok: true });
  } catch (err) { isNotFound(err) ? res.status(404).json({ error: 'Paper not found' }) : next(err); }
});

export default router;
