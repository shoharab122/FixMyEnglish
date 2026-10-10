import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { awardXp } from '../../lib/gamification.js';
import { uid } from '../../lib/req.js';

const router = Router();

const XP_FIRST_CORRECT = 10;

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

router.get('/topics', optionalAuth, async (_req, res, next) => {
  try {
    const topics = await prisma.grammarTopic.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { questions: true } } },
    });
    res.json(topics.map((t) => ({
      id: t.slug, name: t.name, category: t.category, questionCount: t._count.questions,
    })));
  } catch (e) {
    next(e);
  }
});

router.get('/:topicId/questions', optionalAuth, async (req, res, next) => {
  try {
    const topic = await prisma.grammarTopic.findUnique({ where: { slug: req.params.topicId } });
    if (!topic) return res.json([]);

    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const rows = await prisma.grammarQuestion.findMany({ where: { topicId: topic.id } });
    const picked = (req.query.shuffle === '0' ? rows : shuffle(rows)).slice(0, limit);

    // NOTE: answer/a are kept so the current frontend keeps working.
    // Once Grammar.jsx relies only on POST /questions/:id/attempt, remove them.
    res.json(picked.map((q) => ({
      id: q.id, prompt: q.prompt, options: q.options,
      answer: q.correctAnswer, a: q.correctAnswer,
      explain: q.explanation, banglaExplain: q.banglaExplain, topic: topic.name,
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/questions/:questionId/attempt', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);

    const raw = req.body?.answer;
    if (typeof raw !== 'string' && typeof raw !== 'number') {
      return res.status(400).json({ error: 'answer is required' });
    }
    const answer = String(raw).trim().slice(0, 300);
    if (!answer) return res.status(400).json({ error: 'answer is required' });

    const q = await prisma.grammarQuestion.findUnique({ where: { id: req.params.questionId } });
    if (!q) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = answer === String(q.correctAnswer).trim();

    const attempt = await prisma.grammarAttempt.create({
      data: { userId, questionId: q.id, isCorrect, answer },
    });

    // XP only for the FIRST correct answer to a question. Checked after the insert
    // by asking "is my attempt the earliest correct one?", so two simultaneous
    // requests cannot both be paid.
    let firstCorrect = false;
    if (isCorrect) {
      const first = await prisma.grammarAttempt.findFirst({
        where: { userId, questionId: q.id, isCorrect: true },
        orderBy: [{ attemptedAt: 'asc' }, { id: 'asc' }],
        select: { id: true },
      });
      firstCorrect = first?.id === attempt.id;
    }

    let xpGained = 0;
    let summary: unknown = null;
    let unlocked: unknown[] = [];
    try {
      const out = await awardXp(userId, firstCorrect ? XP_FIRST_CORRECT : 0, {
        source: 'grammar',
        answered: 1,
      });
      xpGained = out.xpGained ?? 0;
      summary = out.summary ?? null;
      unlocked = out.unlocked ?? [];
    } catch (xpErr) {
      // Never fail the answer because XP/gamification had a problem.
      console.error('[grammar] awardXp failed', xpErr);
    }

    res.json({
      isCorrect,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      banglaExplain: q.banglaExplain,
      xpGained,
      summary,
      unlocked,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
