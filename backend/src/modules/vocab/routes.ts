import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { awardXp } from '../../lib/gamification.js';
import { uid, optUid } from '../../lib/req.js';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

const GRADES = ['again', 'hard', 'good', 'easy'] as const;
type Grade = (typeof GRADES)[number];
const STAGE: Record<Grade, number> = { again: 0, hard: 1, good: 2, easy: 3 };
const DAYS = [0, 1, 3, 7];
const XP: Record<Grade, number> = { again: 0, hard: 3, good: 5, easy: 8 };

/* ---------- helpers ---------- */

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function shapeWord(w: Row) {
  return {
    id: w.id, word: w.word, meaning: w.meaningEn, meaningBn: w.meaningBn ?? null,
    example: w.example, pos: w.pos, synonyms: w.synonyms, unit: w.textbookUnit ?? null,
  };
}

/** A random alphabetical window, so quizzes don't always use the same first words. */
async function randomWords(n: number): Promise<Row[]> {
  const total = await prisma.vocabWord.count();
  if (!total) return [];
  const take = Math.min(total, n);
  const skip = total > take ? Math.floor(Math.random() * (total - take + 1)) : 0;
  const rows = await prisma.vocabWord.findMany({ orderBy: { word: 'asc' }, skip, take });
  return shuffle(rows);
}

function buildMcqQuestions(pool: Row[], count: number) {
  return shuffle(pool).slice(0, count).map((w) => {
    const wrong: string[] = [];
    for (const o of shuffle(pool)) {
      if (wrong.length >= 3) break;
      if (o.id === w.id || o.meaningEn === w.meaningEn || wrong.includes(o.meaningEn)) continue;
      wrong.push(o.meaningEn);
    }
    const options = shuffle([w.meaningEn, ...wrong]);
    // NOTE: answer/a are kept so the current frontend keeps working.
    return {
      id: w.id,
      word: { id: w.id, w: w.word },
      prompt: `What does \u201C${w.word}\u201D mean?`,
      options,
      answer: w.meaningEn,
      a: w.meaningEn,
    };
  });
}

/* ---------- word of the day ---------- */

router.get('/word-of-day', optionalAuth, async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let wod = await prisma.wordOfDay.findUnique({ where: { date: today }, include: { word: true } });
    if (!wod) {
      const count = await prisma.vocabWord.count();
      if (!count) {
        return res.json({
          word: 'resilience',
          meaning: 'the ability to recover quickly from difficulties',
          meaningBn: null,
          example: 'The resilience of the people is remarkable.',
          pos: 'noun',
          synonyms: ['toughness'],
        });
      }
      const idx = Math.floor(today.getTime() / 86400000) % count;
      const [pick] = await prisma.vocabWord.findMany({ orderBy: [{ word: 'asc' }, { id: 'asc' }], skip: idx, take: 1 });
      try {
        wod = await prisma.wordOfDay.create({ data: { date: today, wordId: pick.id }, include: { word: true } });
      } catch {
        // another request created today's row first
        wod = await prisma.wordOfDay.findUnique({ where: { date: today }, include: { word: true } });
      }
      if (!wod) throw new Error('Could not resolve word of the day');
    }

    res.json({
      word: wod.word.word,
      meaning: wod.word.meaningEn,
      meaningBn: wod.word.meaningBn,
      example: wod.word.example,
      pos: wod.word.pos,
      synonyms: wod.word.synonyms,
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- study deck ---------- */

router.get('/deck', optionalAuth, async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 1, 50, 30);
    const me = optUid(req);

    if (!me) {
      const words = await randomWords(limit);
      return res.json(words.map(shapeWord));
    }

    // 1) words due for review, 2) fill the rest with words the user hasn't started
    const due = await prisma.vocabProgress.findMany({
      where: { userId: me, nextReviewAt: { lte: new Date() } },
      include: { word: true },
      orderBy: { nextReviewAt: 'asc' },
      take: limit,
    });
    const deck: Row[] = due.map((p) => p.word);

    if (deck.length < limit) {
      const seen = await prisma.vocabProgress.findMany({ where: { userId: me }, select: { wordId: true } });
      const fresh = await prisma.vocabWord.findMany({
        where: { id: { notIn: seen.map((s) => s.wordId) } },
        orderBy: { word: 'asc' },
        take: limit - deck.length,
      });
      deck.push(...fresh);
    }

    // everything learned and nothing due: let them browse instead of an empty page
    if (!deck.length) deck.push(...(await randomWords(limit)));

    res.json(deck.map(shapeWord));
  } catch (e) {
    next(e);
  }
});

/* ---------- review (spaced repetition) ---------- */

router.post('/:wordId/review', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);
    const wordId = req.params.wordId;
    const grade = String(req.body?.grade ?? '') as Grade;
    if (!GRADES.includes(grade)) {
      return res.status(400).json({ error: `grade must be one of: ${GRADES.join(', ')}` });
    }

    const word = await prisma.vocabWord.findUnique({ where: { id: wordId }, select: { id: true } });
    if (!word) return res.status(404).json({ error: 'Word not found' });

    const srsStage = STAGE[grade];
    const nextReviewAt = new Date(Date.now() + DAYS[srsStage] * 86400_000);
    const key = { userId_wordId: { userId, wordId } };

    // Only a word that is actually due earns XP (stops review-spam farming).
    const existing = await prisma.vocabProgress.findUnique({ where: key, select: { nextReviewAt: true } });
    const due = !existing || !existing.nextReviewAt || existing.nextReviewAt <= new Date();

    await prisma.vocabProgress.upsert({
      where: key,
      create: {
        userId, wordId, srsStage, nextReviewAt,
        correctCount: grade === 'again' ? 0 : 1,
        wrongCount: grade === 'again' ? 1 : 0,
      },
      update: {
        srsStage, nextReviewAt,
        ...(grade === 'again' ? { wrongCount: { increment: 1 } } : { correctCount: { increment: 1 } }),
      },
    });

    let xpGained = 0;
    let summary: unknown = null;
    let unlocked: unknown[] = [];
    try {
      const out = await awardXp(userId, due ? XP[grade] : 0, { source: 'vocab', answered: 1 });
      xpGained = out.xpGained ?? 0;
      summary = out.summary ?? null;
      unlocked = out.unlocked ?? [];
    } catch (xpErr) {
      // Never fail the review because XP/gamification had a problem.
      console.error('[vocab] awardXp failed', xpErr);
    }

    res.json({ ok: true, nextReviewAt, xpGained, summary, unlocked });
  } catch (e) {
    next(e);
  }
});

/* ---------- quiz / blitz ---------- */

router.get('/quiz', optionalAuth, async (req, res, next) => {
  try {
    const count = clampInt(req.query.count, 1, 20, 10);
    const pool = await randomWords(Math.min(80, count * 4));
    res.json({ questions: buildMcqQuestions(pool, count) });
  } catch (e) {
    next(e);
  }
});

router.get('/blitz', optionalAuth, async (_req, res, next) => {
  try {
    const pool = await randomWords(80);
    res.json({ questions: buildMcqQuestions(pool, 20) });
  } catch (e) {
    next(e);
  }
});

export default router;
