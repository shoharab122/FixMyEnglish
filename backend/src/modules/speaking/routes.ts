import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.js';
import { requireTier } from '../../middleware/tier.js';
import { prisma } from '../../lib/prisma.js';
import { awardXp } from '../../lib/gamification.js';
import { uid } from '../../lib/req.js';
import { getSpeechProvider } from './provider.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

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
    const durationSeconds = Number(req.body?.durationSeconds ?? 0);
    const audioSize = req.file?.size ?? 0;
    const provider = getSpeechProvider();

    const scored = await provider.score(req.file?.buffer ?? Buffer.alloc(0), {
      promptText: prompt?.promptText ?? req.body?.promptText ?? '',
      durationSeconds: durationSeconds || Math.round(audioSize / 16000) || 30,
    });

    const attempt = await prisma.speakingAttempt.create({
      data: {
        userId, promptId,
        promptText: prompt?.promptText ?? req.body?.promptText ?? '',
        durationSeconds: Math.round(durationSeconds || 30),
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

    const seconds = Math.round(durationSeconds || 30);
    const { summary, unlocked, xpGained } = await awardXp(userId, 20, {
      source: 'speaking',
      answered: 0,
      minutes: Math.max(1, Math.round(seconds / 60)), // old code stored seconds here
      meta: { band: scored.overall },
    });

    res.json({ ...shapeAttempt(attempt), xpGained, summary, unlocked });
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
    const sessionId = req.params.sessionId;
    const existing = await prisma.convSession.findUnique({ where: { id: sessionId } });
    if (!existing) {
      await prisma.convSession.create({
        data: { id: sessionId, userId: uid(req), scenario: 'general' },
      }).catch(() => { /* ignore duplicate create race */ });
    }
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
