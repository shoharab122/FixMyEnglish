import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/word-of-day', optionalAuth, async (_req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let wod = await prisma.wordOfDay.findUnique({ where: { date: today }, include: { word: true } });
    if (!wod) {
      const count = await prisma.vocabWord.count();
      if (!count) return res.json({ word: 'resilience', meaning: 'the ability to recover quickly from difficulties', example: 'The resilience of the people is remarkable.' });
      const idx = Math.floor((today.getTime() / 86400000) % count);
      const words = await prisma.vocabWord.findMany({ skip: idx, take: 1 });
      const pick = words[0]!;
      wod = await prisma.wordOfDay.create({ data: { date: today, wordId: pick.id }, include: { word: true } });
    }
    res.json({
      word: wod.word.word,
      meaning: wod.word.meaningEn,
      meaningBn: wod.word.meaningBn,
      example: wod.word.example,
      pos: wod.word.pos,
      synonyms: wod.word.synonyms,
    });
  } catch (e) { next(e); }
});

router.get('/deck', optionalAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      const words = await prisma.vocabWord.findMany({ take: 30, orderBy: { word: 'asc' } });
      return res.json(words.map(shapeWord));
    }
    const due = await prisma.vocabProgress.findMany({
      where: { userId: req.user.id, nextReviewAt: { lte: new Date() } },
      include: { word: true }, take: 50,
    });
    if (due.length) return res.json(due.map((p) => shapeWord(p.word)));
    const words = await prisma.vocabWord.findMany({ take: 30, orderBy: { word: 'asc' } });
    res.json(words.map(shapeWord));
  } catch (e) { next(e); }
});

router.post('/:wordId/review', requireAuth, async (req, res, next) => {
  try {
    const { grade } = req.body ?? {};
    const stages: any = { again: 0, hard: 1, good: 2, easy: 3 };
    const srsStage = stages[grade] ?? 1;
    const days = [0, 1, 3, 7][srsStage] ?? 1;
    await prisma.vocabProgress.upsert({
      where: { userId_wordId: { userId: req.user!.id, wordId: req.params.wordId } },
      create: {
        userId: req.user!.id, wordId: req.params.wordId, srsStage,
        nextReviewAt: new Date(Date.now() + days * 86400_000),
        correctCount: grade === 'again' ? 0 : 1,
        wrongCount: grade === 'again' ? 1 : 0,
      },
      update: {
        srsStage,
        nextReviewAt: new Date(Date.now() + days * 86400_000),
        ...(grade === 'again'
          ? { wrongCount: { increment: 1 } }
          : { correctCount: { increment: 1 } }),
      },
    });
    await bumpDailyXp(req.user!.id, grade === 'again' ? 1 : grade === 'hard' ? 3 : grade === 'good' ? 5 : 8);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/quiz', optionalAuth, async (req, res, next) => {
  try {
    const count = Math.min(20, Number(req.query.count) || 10);
    const pool = await prisma.vocabWord.findMany({ take: count * 3, orderBy: { word: 'asc' } });
    res.json({ questions: buildMcqQuestions(pool, count) });
  } catch (e) { next(e); }
});

router.get('/blitz', optionalAuth, async (_req, res, next) => {
  try {
    const pool = await prisma.vocabWord.findMany({ take: 60 });
    res.json({ questions: buildMcqQuestions(pool, 20) });
  } catch (e) { next(e); }
});

function shapeWord(w: any) {
  return { id: w.id, word: w.word, meaning: w.meaningEn, example: w.example, pos: w.pos, synonyms: w.synonyms };
}

function buildMcqQuestions(pool: any[], count: number) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((w) => {
    const others = pool.filter((x) => x.id !== w.id).slice(0, 20).sort(() => Math.random() - 0.5);
    const wrong: string[] = [];
    for (const o of others) {
      if (wrong.length >= 3) break;
      if (!wrong.includes(o.meaningEn)) wrong.push(o.meaningEn);
    }
    const options = [w.meaningEn, ...wrong].sort(() => Math.random() - 0.5);
    return {
      id: w.id,
      word: { id: w.id, w: w.word },
      prompt: `What does “${w.word}” mean?`,
      options,
      answer: w.meaningEn,
      a: w.meaningEn,
    };
  });
}

async function bumpDailyXp(userId: string, amount: number) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  await prisma.userStatsDaily.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, xpEarned: amount, questionsAnswered: 1 },
    update: { xpEarned: { increment: amount }, questionsAnswered: { increment: 1 } },
  });
  await prisma.user.update({ where: { id: userId }, data: { xp: { increment: amount } } });
}

export default router;
