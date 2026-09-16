import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/topics', optionalAuth, async (_req, res, next) => {
  try {
    const topics = await prisma.grammarTopic.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { questions: true } } },
    });
    res.json(topics.map((t) => ({
      id: t.slug, name: t.name, category: t.category, questionCount: t._count.questions,
    })));
  } catch (e) { next(e); }
});

router.get('/:topicId/questions', optionalAuth, async (req, res, next) => {
  try {
    const topic = await prisma.grammarTopic.findUnique({ where: { slug: req.params.topicId } });
    if (!topic) return res.json([]);
    const questions = await prisma.grammarQuestion.findMany({ where: { topicId: topic.id } });
    res.json(questions.map((q) => ({
      id: q.id, prompt: q.prompt, options: q.options,
      answer: q.correctAnswer, a: q.correctAnswer,
      explain: q.explanation, banglaExplain: q.banglaExplain, topic: topic.name,
    })));
  } catch (e) { next(e); }
});

router.post('/questions/:questionId/attempt', requireAuth, async (req, res, next) => {
  try {
    const { answer } = req.body ?? {};
    const q = await prisma.grammarQuestion.findUnique({ where: { id: req.params.questionId } });
    if (!q) return res.status(404).json({ error: 'Question not found' });
    const isCorrect = q.correctAnswer === answer;
    await prisma.grammarAttempt.create({
      data: { userId: req.user!.id, questionId: q.id, isCorrect, answer: String(answer ?? '') },
    });
    const today = new Date(); today.setHours(0, 0, 0, 0);
    await prisma.userStatsDaily.upsert({
      where: { userId_date: { userId: req.user!.id, date: today } },
      create: { userId: req.user!.id, date: today, xpEarned: isCorrect ? 10 : 0, questionsAnswered: 1 },
      update: { xpEarned: { increment: isCorrect ? 10 : 0 }, questionsAnswered: { increment: 1 } },
    });
    if (isCorrect) {
      await prisma.user.update({ where: { id: req.user!.id }, data: { xp: { increment: 10 } } });
    }
    res.json({ isCorrect, correctAnswer: q.correctAnswer, explanation: q.explanation, banglaExplain: q.banglaExplain });
  } catch (e) { next(e); }
});

export default router;
