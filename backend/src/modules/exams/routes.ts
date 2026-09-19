import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

function iconFor(section: string) {
  switch (String(section || '').toLowerCase()) {
    case 'listening': return 'bell';
    case 'reading':   return 'book';
    case 'writing':   return 'chat';
    case 'speaking':  return 'mic';
    case 'math':      return 'target';
    default:          return 'flag';
  }
}

/* ============================================================
   GET /api/exams/tracks
   Returns tracks with sections (sets) INCLUDING question counts.
   ============================================================ */
router.get('/tracks', optionalAuth, async (_req, res, next) => {
  try {
    const tracks = await prisma.examTrack.findMany({
      include: {
        sets: {
          include: {
            _count: { select: { questions: true } },
          },
        },
      },
    });

    const payload = tracks.map((t) => ({
      id: t.slug,
      name: t.name,
      icon: t.icon || 'flag',
      sections: (t.sets || []).map((s) => ({
        id: s.id,
        name: s.section || s.title,
        mins: s.durationMinutes ?? 60,
        durationMinutes: s.durationMinutes ?? 60,
        questions: s._count?.questions ?? 0,
        questionCount: s._count?.questions ?? 0,
        icon: iconFor(s.section),
        isPremium: !!s.isPremium,
      })),
    }));

    console.log('[GET /tracks] sending', payload.length, 'tracks,',
      payload.reduce((n, t) => n + t.sections.length, 0), 'sections');

    res.json(payload);
  } catch (e) { next(e); }
});

/* ============================================================
   POST /api/exams/:trackId/start
   ============================================================ */
router.post('/:trackId/start', optionalAuth, async (req, res, next) => {
  try {
    const track = await prisma.examTrack.findUnique({ where: { slug: req.params.trackId } });
    if (!track) return res.status(404).json({ error: 'Track not found' });

    const { section } = req.body ?? {};
    const set =
      (await prisma.examSet.findFirst({
        where: { trackId: track.id, ...(section ? { section } : {}) },
      })) ||
      (await prisma.examSet.findFirst({ where: { trackId: track.id } }));

    if (!set) return res.status(404).json({ error: 'No set for this section' });

    const session = await prisma.examSession.create({
      data: { userId: req.user?.id ?? null, examSetId: set.id, status: 'in_progress' },
    });

    const questions = await prisma.examQuestion.findMany({
      where: { examSetId: set.id },
      orderBy: { orderIndex: 'asc' },
    });

    res.json({
      attemptId: session.id,
      examSetId: set.id,
      durationMinutes: set.durationMinutes,
      questions: questions.map((q) => ({
        id: q.id,
        orderIndex: q.orderIndex,
        type: q.type || 'mcq',
        prompt: q.prompt,
        options: q.options,
        mediaUrl: q.mediaUrl || null,
        points: q.points,
      })),
    });
  } catch (e) { next(e); }
});

/* ============================================================
   POST /api/exams/attempts/:attemptId/submit
   ============================================================ */
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
          data: {
            sessionId: session.id,
            questionId: q.id,
            answer: String(given),
            isCorrect,
            pointsAwarded: isCorrect ? q.points : 0,
          },
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

/* ============================================================
   POST /api/admin/exams/sets/:setId/seed-sample
   One-click: fills a set with 5 sample MCQ questions.
   ============================================================ */
router.post('/admin/seed-sample/:setId', requireAuth, async (req, res, next) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const { setId } = req.params;
    const set = await prisma.examSet.findUnique({ where: { id: setId } });
    if (!set) return res.status(404).json({ error: 'Set not found' });

    const samples = [
      { prompt: 'She ___ to school every day.', options: ['go','goes','going','gone'], correctAnswer: 'goes', points: 1, orderIndex: 0 },
      { prompt: 'They ___ football yesterday.', options: ['play','plays','played','playing'], correctAnswer: 'played', points: 1, orderIndex: 1 },
      { prompt: 'I have never ___ sushi.', options: ['eat','eats','eaten','ate'], correctAnswer: 'eaten', points: 1, orderIndex: 2 },
      { prompt: 'If it rains, we ___ stay home.', options: ['will','would','had','am'], correctAnswer: 'will', points: 1, orderIndex: 3 },
      { prompt: 'He is good ___ mathematics.', options: ['in','on','at','for'], correctAnswer: 'at', points: 1, orderIndex: 4 },
    ];

    const created = await Promise.all(
      samples.map((s) =>
        prisma.examQuestion.create({
          data: { examSetId: setId, ...s, type: 'mcq' },
        })
      )
    );

    res.json({ ok: true, count: created.length });
  } catch (e) { next(e); }
});

export default router;
