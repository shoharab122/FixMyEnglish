import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.js';
import { requireTier } from '../../middleware/tier.js';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { awardXp } from '../../lib/gamification.js';
import { dayStart } from '../../lib/time.js';
import { uid } from '../../lib/req.js';
import { getSpeechProvider, getMockProvider } from './provider.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const MIN_AUDIO_BYTES = 6000;        // below this there is no real recording
const MAX_SECONDS = 600;
const XP_PER_ATTEMPT = 20;
const XP_ATTEMPTS_PER_DAY = 10;      // attempts beyond this still work, they just don't pay XP
const SESSION_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

router.get('/prompts', async (_req, res, next) => {
  try {
    const prompts = await prisma.speakingPrompt.findMany({ take: 200 });
    res.json(prompts.map((p) => ({
      id: p.id, category: p.category, prompt: p.promptText,
      prepSeconds: p.prepSeconds, responseSeconds: p.responseSeconds, trackSlug: p.trackSlug,
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/:promptId/attempt', requireAuth, requireTier('free'), upload.single('audio'), async (req, res, next) => {
  try {
    const userId = uid(req);
    const promptId = req.params.promptId === 'freestyle' ? null : req.params.promptId;
    const prompt = promptId ? await prisma.speakingPrompt.findUnique({ where: { id: promptId } }) : null;
    if (promptId && !prompt) return res.status(404).json({ error: 'Prompt not found' });

    const audio = req.file?.buffer ?? Buffer.alloc(0);
    const hasAudio = audio.length >= MIN_AUDIO_BYTES;
    const promptText = prompt?.promptText ?? clean(req.body?.promptText, 500);

    const given = Number(req.body?.durationSeconds);
    const guess = Number.isFinite(given) && given > 0 ? given : Math.round(audio.length / 16000) || 30;
    const durationSeconds = Math.min(MAX_SECONDS, Math.max(1, Math.round(guess)));

    // A failing provider must not break practice: fall back to the mock scorer.
    let scored;
    try {
      scored = await getSpeechProvider().score(audio, { promptText, durationSeconds });
    } catch (err) {
      console.error('[speaking] provider failed, using mock', err);
      scored = await getMockProvider().score(audio, { promptText, durationSeconds });
    }
    const isMock = scored.provider === 'mock';

    // XP only for real recordings, real scoring (not mock in production), and a daily cap.
    const dhakaMidnightUtc = new Date(dayStart().getTime() - 6 * 3600_000);
    const attemptsToday = await prisma.speakingAttempt.count({
      where: { userId, createdAt: { gte: dhakaMidnightUtc } },
    });
    const xpEligible = hasAudio && !(isMock && env.isProd) && attemptsToday < XP_ATTEMPTS_PER_DAY;

    const attempt = await prisma.speakingAttempt.create({
      data: {
        userId, promptId, promptText, durationSeconds,
        transcript: scored.transcript,
        fluencyScore: scored.fluency,
        pronunciationScore: scored.pronunciation,
        grammarScore: scored.grammar,
        vocabularyScore: scored.vocabulary,
        overallBand: scored.overall,
        feedback: scored.feedback,
        providerUsed: scored.provider,
      },
    });

    let xpGained = 0;
    let summary: unknown = null;
    let unlocked: unknown[] = [];
    try {
      const out = await awardXp(userId, xpEligible ? XP_PER_ATTEMPT : 0, {
        source: 'speaking',
        answered: 0,
        minutes: xpEligible ? Math.max(1, Math.round(durationSeconds / 60)) : 0,
        meta: { band: scored.overall },
      });
      xpGained = out.xpGained ?? 0;
      summary = out.summary ?? null;
      unlocked = out.unlocked ?? [];
    } catch (xpErr) {
      console.error('[speaking] awardXp failed', xpErr);
    }

    res.json({ ...shapeAttempt(attempt), xpGained, summary, unlocked, mock: isMock, recorded: hasAudio });
  } catch (e) {
    next(e);
  }
});

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const rows = await prisma.speakingAttempt.findMany({
      where: { userId: uid(req) }, orderBy: { createdAt: 'desc' }, take: 30,
    });
    res.json(rows.map((r) => ({
      id: r.id, prompt: r.promptText,
      date: r.createdAt.toISOString().slice(0, 10),
      overall: r.overallBand ?? 0,
    })));
  } catch (e) {
    next(e);
  }
});

router.post('/conversation/:sessionId/turn', requireAuth, requireTier('free'), upload.single('audio'), async (req, res, next) => {
  try {
    const userId = uid(req);
    const sessionId = req.params.sessionId;
    if (!SESSION_ID_RE.test(sessionId)) return res.status(400).json({ error: 'Invalid session id' });

    let session = await prisma.convSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      session = await prisma.convSession.create({
        data: { id: sessionId, userId, scenario: 'general' },
      }).catch(() => prisma.convSession.findUnique({ where: { id: sessionId } })); // lost a create race
    }
    // The client picks the id, so never let one user write into another's session.
    if (!session || session.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const replies = [
      "That's interesting — can you tell me more?",
      'Why do you think that matters to you?',
      'How did that make you feel at the time?',
      'Would you do anything differently now?',
      'Can you give me a specific example?',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    res.json({ reply, text: reply });
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeAttempt(a: any) {
  return {
    id: a.id, prompt: a.promptText,
    date: a.createdAt.toISOString().slice(0, 10),
    overall: a.overallBand, fluency: a.fluencyScore,
    pronunciation: a.pronunciationScore, grammar: a.grammarScore,
    vocabulary: a.vocabularyScore, feedback: a.feedback,
    transcript: a.transcript, duration: a.durationSeconds,
  };
}

export default router;
