import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { awardXp } from '../../lib/gamification.js';
import { uid } from '../../lib/req.js';

const router = Router();

const XP_FIRST_CORRECT = 10;

// The current Grammar.jsx still uses local ids t1..t17. Map them to the DB slugs so
// old clients keep working. Remove once the frontend uses the slugs from /topics.
const LEGACY_TOPIC: Record<string, string> = {
  t1: 'present-simple', t2: 'present-continuous', t3: 'present-perfect', t4: 'past-simple',
  t5: 'past-continuous', t6: 'future-tenses', t7: 'articles', t8: 'prepositions',
  t9: 'sva', t10: 'conditionals', t11: 'modals', t12: 'voice', t13: 'narration',
  t14: 'nouns-pronouns', t15: 'adjectives-adverbs', t16: 'clauses', t17: 'punctuation',
};

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
    const slug = LEGACY_TOPIC[req.params.topicId] ?? req.params.topicId;
    const topic = await prisma.grammarTopic.findUnique({ where: { slug } });
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

    // Insert + "was there already a correct attempt?" run under a per-(user,question)
    // advisory lock, so two simultaneous requests can never both be paid.
    const { firstCorrect } = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${userId}:${q.id}`}))`;
      const attempt = await tx.grammarAttempt.create({
        data: { userId, questionId: q.id, isCorrect, answer },
      });
      let first = false;
      if (isCorrect) {
        const prior = await tx.grammarAttempt.findFirst({
          where: { userId, questionId: q.id, isCorrect: true, id: { not: attempt.id } },
          select: { id: true },
        });
        first = !prior;
      }
      return { firstCorrect: first };
    });

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
      firstCorrect,
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