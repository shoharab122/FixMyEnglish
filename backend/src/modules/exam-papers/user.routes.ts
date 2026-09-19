import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

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
    const { answers } = (req.body || {});
    const attempt = await prisma.examPaperAttempt.findUnique({
      where: { id: req.params.attemptId },
      include: { paper: { include: { sections: { include: { questions: true } } } } },
    });
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
    if (attempt.userId && attempt.userId !== req.user.id) return res.status(403).json({ error: 'Not your attempt' });
    if (attempt.submittedAt) return res.json({ id: attempt.id, total: attempt.total, score: attempt.score, alreadySubmitted: true });
    const all = attempt.paper.sections.flatMap((s) => s.questions);
    const safeAnswers = answers ?? {};
    let correct = 0;
    for (const q of all) if (safeAnswers[q.id] === q.answer) correct++;
    const total = all.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    const updated = await prisma.examPaperAttempt.update({
      where: { id: attempt.id },
      data: { answers: safeAnswers, score, total, submittedAt: new Date() },
    });
    res.json({ id: updated.id, correct, total, score });
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
    res.json(paper);
  } catch (err) { next(err); }
});

router.post('/:id/start', async (req, res, next) => {
  try {
    const paper = await prisma.examPaper.findUnique({ where: { id: req.params.id } });
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    if (paper.status === 'draft' || paper.status === 'archived') return res.status(403).json({ error: 'This paper is not open.' });
    const attempt = await prisma.examPaperAttempt.create({
      data: { paperId: paper.id, userId: req.user.id, userName: req.user.name },
    });
    res.json({ id: attempt.id, startedAt: attempt.startedAt });
  } catch (err) { next(err); }
});

export default router;
