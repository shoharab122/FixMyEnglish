import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.js';
import { requireTier } from '../../middleware/tier.js';
import { prisma } from '../../lib/prisma.js';
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
  } catch (e) { next(e); }
});

router.post(
  '/:promptId/attempt',
  requireAuth, requireTier('free'), upload.single('audio'),
  async (req, res, next) => {
    try {
      const promptId = req.params.promptId === 'freestyle' ? null : req.params.promptId;
      const prompt = promptId ? await prisma.speakingPrompt.findUnique({ where: { id: promptId } }) : null;
      const durationSeconds = Number((req.body as any)?.durationSeconds ?? 0);
      const audioSize = req.file?.size ?? 0;

      const provider = getSpeechProvider();
      const scored = await provider.score(req.file?.buffer ?? Buffer.alloc(0), {
        promptText: prompt?.promptText ?? (req.body as any)?.promptText ?? '',
        durationSeconds: durationSeconds || Math.round(audioSize / 16000) || 30,
      });

      const attempt = await prisma.speakingAttempt.create({
        data: {
          userId: req.user!.id, promptId,
          promptText: prompt?.promptText ?? (req.body as any)?.promptText ?? '',
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

      await prisma.user.update({ where: { id: req.user!.id }, data: { xp: { increment: 20 } } });
      const today = new Date(); today.setHours(0, 0, 0, 0);
      await prisma.userStatsDaily.upsert({
        where: { userId_date: { userId: req.user!.id, date: today } },
        create: { userId: req.user!.id, date: today, xpEarned: 20, minutesActive: Math.round(durationSeconds || 30) },
        update: { xpEarned: { increment: 20 }, minutesActive: { increment: Math.round(durationSeconds || 30) } },
      });

      res.json(shapeAttempt(attempt));
    } catch (e) { next(e); }
  }
);

router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const rows = await prisma.speakingAttempt.findMany({
      where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, take: 30,
    });
    res.json(rows.map((r) => ({
      id: r.id, prompt: r.promptText,
      date: r.createdAt.toISOString().slice(0, 10),
      overall: r.overallBand ?? 0,
    })));
  } catch (e) { next(e); }
});

router.post(
  '/conversation/:sessionId/turn',
  requireAuth, requireTier('free'), upload.single('audio'),
  async (req, res, next) => {
    try {
      const sessionId = req.params.sessionId;
      const existing = await prisma.convSession.findUnique({ where: { id: sessionId } });
      if (!existing) {
        await prisma.convSession.create({
          data: { id: sessionId, userId: req.user!.id, scenario: 'general' },
        }).catch(() => {});
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
    } catch (e) { next(e); }
  }
);

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
