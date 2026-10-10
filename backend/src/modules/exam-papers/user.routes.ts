import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middleware/auth.js';
import { uid } from '../../lib/req.js';

const router = Router();
router.use(requireAuth);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

/** What the student may see BEFORE submitting: no answers, no explanations. */
function stripKey(paper: Row) {
  return {
    ...paper,
    sections: paper.sections.map((s: Row) => ({
      ...s,
      questions: s.questions.map(({ answer: _a, explanation: _e, ...q }: Row) => q),
    })),
  };
}

/** Shown only AFTER the attempt is submitted. */
function buildReview(sections: Row[], answers: Record<string, unknown>) {
  return sections.flatMap((s) => s.questions).map((q: Row) => ({
    id: q.id,
    yours: answers[q.id] ?? null,
    answer: q.answer,
    explanation: q.explanation ?? null,
    correct: answers[q.id] === q.answer,
  }));
}

router.get('/', async (_req, res, next) => {
  try {
    const papers = await prisma.examPaper.findMany({
      where: { status: { in: ['published', 'live', 'ended'] } },
      orderBy: [{ status: 'asc' }, { launchedAt: 'desc' }],
      include: {
        sections: { include: { _count: { select: { questions: true } } } },
        _count: { select: { attempts: true } },
      },
    });
    res.json(papers.map((p) => ({
      id: p.id, title: p.title, classLevel: p.classLevel, paper: p.paper,
      board: p.board, year: p.year, durationMins: p.durationMins,
      totalMarks: p.totalMarks, status: p.status, instructions: p.instructions,
      launchedAt: p.launchedAt, endedAt: p.endedAt,
      attemptsCount: p._count?.attempts ?? 0,
      questionCount: p.sections.reduce((s, sec) => s + (sec._count?.questions ?? 0), 0),
    })));
  } catch (err) { next(err); }
});

router.post('/attempts/:attemptId/submit', async (req, res, next) => {
  try {
    const userId = uid(req);
    const attempt = await prisma.examPaperAttempt.findUnique({
      where: { id: req.params.attemptId },
      include: { paper: { include: { sections: { include: { questions: true } } } } },
    });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.userId !== userId) return res.status(403).json({ error: 'Not your attempt' });

    const sections = attempt.paper.sections;
    const all = sections.flatMap((s) => s.questions);

    const already = () => res.json({
      id: attempt.id, total: attempt.total, score: attempt.score, alreadySubmitted: true,
      review: buildReview(sections, (attempt.answers as Record<string, unknown>) ?? {}),
    });
    if (attempt.submittedAt) return already();

    const raw = req.body?.answers;
    const answers: Record<string, unknown> =
      raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};

    let correct = 0;
    for (const q of all) if (answers[q.id] === q.answer) correct++;
    const total = all.length;
    const score = total ? Math.round((correct / total) * 100) : 0;

    // Only one request can flip submittedAt from null, so a double-click can't submit twice.
    const { count } = await prisma.examPaperAttempt.updateMany({
      where: { id: attempt.id, submittedAt: null },
      data: { answers: answers as any, score, total, submittedAt: new Date() },
    });
    if (count === 0) return already();

    res.json({ id: attempt.id, correct, total, score, review: buildReview(sections, answers) });
  } catch (err) { next(err); }
});

/** Answer key + explanations for an attempt the user has already submitted. */
router.get('/attempts/:attemptId/review', async (req, res, next) => {
  try {
    const attempt = await prisma.examPaperAttempt.findUnique({
      where: { id: req.params.attemptId },
      include: { paper: { include: { sections: { include: { questions: true } } } } },
    });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.userId !== uid(req)) return res.status(403).json({ error: 'Not your attempt' });
    if (!attempt.submittedAt) return res.status(403).json({ error: 'Submit the attempt first' });
    res.json({
      id: attempt.id, score: attempt.score, total: attempt.total,
      review: buildReview(attempt.paper.sections, (attempt.answers as Record<string, unknown>) ?? {}),
    });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const paper = await prisma.examPaper.findUnique({
      where: { id: req.params.id },
      include: { sections: { orderBy: { orderIndex: 'asc' }, include: { questions: { orderBy: { orderIndex: 'asc' } } } } },
    });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    if (paper.status === 'draft' || paper.status === 'archived') return res.status(403).json({ error: 'This paper is not available yet.' });
    res.json(stripKey(paper));
  } catch (err) { next(err); }
});

router.post('/:id/start', async (req, res, next) => {
  try {
    const paper = await prisma.examPaper.findUnique({ where: { id: req.params.id } });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    if (paper.status === 'draft' || paper.status === 'archived') return res.status(403).json({ error: 'This paper is not open.' });
    const attempt = await prisma.examPaperAttempt.create({
      data: { paperId: paper.id, userId: uid(req), userName: (req as any).user?.name ?? null },
    });
    res.json({ id: attempt.id, startedAt: attempt.startedAt });
  } catch (err) { next(err); }
});

export default router;
