import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/admin.js';

const router = Router();
router.use(requireAuth, requireAdmin);

async function writeAudit(req, action, targetId) {
  try {
    await prisma.auditLog.create({
      data: { actorId: req.user.id, actorName: req.user.name, action, targetType: 'ExamPaper', targetId: targetId ?? null },
    });
  } catch { /* non-fatal */ }
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
    const { title, classLevel, paper, board, year, durationMins, totalMarks, status, instructions } = req.body || {};
    if (!title || !classLevel || !paper || !board) return res.status(400).json({ error: 'title, classLevel, paper, board are required' });
    const created = await prisma.examPaper.create({
      data: {
        title, classLevel, paper, board,
        year: year ? Number(year) : null,
        durationMins: Number(durationMins) || 180,
        totalMarks: Number(totalMarks) || 100,
        status: status || 'draft',
        instructions: instructions || null,
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
  } catch (err) { next(err); }
});

router.patch('/:id/end', async (req, res, next) => {
  try {
    const updated = await prisma.examPaper.update({
      where: { id: req.params.id },
      data: { status: 'ended', endedAt: new Date() },
    });
    await writeAudit(req, 'examPaper.end', updated.id);
    res.json(updated);
  } catch (err) { next(err); }
});

router.get('/:id/attempts', async (req, res, next) => {
  try {
    const rows = await prisma.examPaperAttempt.findMany({ where: { paperId: req.params.id }, orderBy: { startedAt: 'desc' } });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/:paperId/sections', async (req, res, next) => {
  try {
    const { name, marks, instructions } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Section name required' });
    const section = await prisma.examPaperSection.create({
      data: { paperId: req.params.paperId, name, marks: Number(marks) || 0, instructions: instructions || null },
    });
    await writeAudit(req, 'examPaper.section.create', section.id);
    res.json(section);
  } catch (err) { next(err); }
});

router.post('/:paperId/sections/:sectionId/questions', async (req, res, next) => {
  try {
    const { prompt, options, answer, marks, explanation } = req.body || {};
    if (!prompt || !answer || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'prompt, options (>=2), and answer are required' });
    }
    const question = await prisma.examPaperQuestion.create({
      data: {
        sectionId: req.params.sectionId, prompt, options, answer,
        marks: Number(marks) || 1, explanation: explanation || null,
      },
    });
    await writeAudit(req, 'examPaper.question.create', question.id);
    res.json(question);
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const patch = { ...(req.body || {}) };
    if (patch.year !== undefined) patch.year = patch.year ? Number(patch.year) : null;
    if (patch.durationMins !== undefined) patch.durationMins = Number(patch.durationMins);
    if (patch.totalMarks !== undefined) patch.totalMarks = Number(patch.totalMarks);
    const updated = await prisma.examPaper.update({ where: { id: req.params.id }, data: patch });
    await writeAudit(req, 'examPaper.update', updated.id);
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.examPaper.delete({ where: { id: req.params.id } });
    await writeAudit(req, 'examPaper.delete', req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
