import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

function iconFor(section: string) {
  switch (section.toLowerCase()) {
    case 'listening': return 'bell';
    case 'reading':   return 'book';
    case 'writing':   return 'chat';
    case 'speaking':  return 'mic';
    case 'math':      return 'target';
    default:          return 'flag';
  }
}

router.get('/tracks', optionalAuth, async (_req, res, next) => {
  try {
    const tracks = await prisma.examTrack.findMany({ include: { sets: true } });
    res.json(tracks.map((t) => ({
      id: t.slug, name: t.name, icon: t.icon,
      sections: t.sets.map((s) => ({
        id: s.id, name: s.section, mins: s.durationMinutes,
        questions: 0, icon: iconFor(s.section), isPremium: s.isPremium,
      })),
    })));
  } catch (e) { next(e); }
});

router.post('/:trackId/start', optionalAuth, async (req, res, next) => {
  try {
    const track = await prisma.examTrack.findUnique({ where: { slug: req.params.trackId } });
    if (!track) return res.status(404).json({ error: 'Track not found' });
    const { section } = req.body ?? {};
    const set = await prisma.examSet.findFirst({
      where: { trackId: track.id, ...(section ? { section } : {}) },
    }) ?? await prisma.examSet.findFirst({ where: { trackId: track.id } });
    if (!set) return res.status(404).json({ error: 'No set for this section' });

    const session = await prisma.examSession.create({
      data: { userId: req.user?.id ?? null, examSetId: set.id, status: 'in_progress' },
    });
    const questions = await prisma.examQuestion.findMany({
      where: { examSetId: set.id }, orderBy: { orderIndex: 'asc' },
    });
    res.json({
      attemptId: session.id, examSetId: set.id, durationMinutes: set.durationMinutes,
      questions: questions.map((q) => ({
        id: q.id, orderIndex: q.orderIndex, type: q.type,
        prompt: q.prompt, options: q.options, mediaUrl: q.mediaUrl, points: q.points,
      })),
    });
  } catch (e) { next(e); }
});

router.post('/attempts/:attemptId/submit', optionalAuth, async (req, res, next) => {
  try {
    const { answers } = req.body ?? {};
    const session = await prisma.examSession.findUnique({ where: { id: req.params.attemptId } });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const questions = await prisma.examQuestion.findMany({ where: { examSetId: session.examSetId } });
    let score = 0, maxScore = 0;
    for (const q of questions) {
      maxScore += q.points;
      const given = answers?.[q.id];
      const isCorrect = given != null && String(given).trim() === q.correctAnswer;
      if (isCorrect) score += q.points;
      if (given != null) {
        await prisma.examAnswer.create({
          data: { sessionId: session.id, questionId: q.id, answer: String(given), isCorrect, pointsAwarded: isCorrect ? q.points : 0 },
        }).catch(() => {});
      }
    }
    const pct = maxScore ? Math.round((score / maxScore) * 100) : 0;
    await prisma.examSession.update({
      where: { id: session.id },
      data: { status: 'submitted', submittedAt: new Date(), autoScore: score, finalScore: pct },
    });
    res.json({ attemptId: session.id, score, maxScore, percent: pct });
  } catch (e) { next(e); }
});

router.get('/countdown', requireAuth, async (req, res, next) => {
  try {
    const row = await prisma.examCountdown.findFirst({
      where: { userId: req.user!.id }, include: { track: true },
    });
    if (!row) return res.json(null);
    res.json({ trackId: row.track.slug, examDate: row.targetExamDate });
  } catch (e) { next(e); }
});

router.post('/countdown', requireAuth, async (req, res, next) => {
  try {
    const { trackId, examDate } = req.body ?? {};
    const track = await prisma.examTrack.findUnique({ where: { slug: trackId } });
    if (!track) return res.status(400).json({ error: 'Unknown track' });
    const row = await prisma.examCountdown.upsert({
      where: { userId_trackId: { userId: req.user!.id, trackId: track.id } },
      create: { userId: req.user!.id, trackId: track.id, targetExamDate: new Date(examDate) },
      update: { targetExamDate: new Date(examDate) },
    });
    res.json({ trackId: track.slug, examDate: row.targetExamDate });
  } catch (e) { next(e); }
});

export default router;
