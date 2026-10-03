import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { streamChat, askOnce, type ChatMessage } from './service.js';
import { ALL_ENTRIES, suggestForPage } from './knowledge.js';
import { log } from '../../lib/logger.js';

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages — slow down a sec.' },
});

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

const ChatBodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
  page: z.string().max(120).optional(),
  userName: z.string().max(80).optional(),
  tier: z.enum(['guest', 'free', 'premium']).optional(),
});

router.post('/chat', chatLimiter, async (req, res, next) => {
  try {
    const parsed = ChatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid body', issues: parsed.error.issues });
    }

    const { messages, page, userName, tier } = parsed.data as {
      messages: ChatMessage[];
      page?: string;
      userName?: string;
      tier?: 'guest' | 'free' | 'premium';
    };

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    (res as any).flushHeaders?.();

    const controller = new AbortController();
    req.on('close', () => controller.abort());

    const stream = await streamChat({
      messages,
      page,
      userName,
      tier,
      signal: controller.signal,
    });

    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } catch (err: any) {
    log.error('[GiMi /chat]', err);
    if (!res.headersSent) next(err);
    else res.end();
  }
});

router.post('/ask', chatLimiter, async (req, res, next) => {
  try {
    const parsed = ChatBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const { messages, page, userName, tier } = parsed.data as {
      messages: ChatMessage[];
      page?: string;
      userName?: string;
      tier?: 'guest' | 'free' | 'premium';
    };
    const answer = await askOnce({ messages, page, userName, tier });
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

router.get('/suggestions', (req, res) => {
  const page = typeof req.query.page === 'string' ? req.query.page : '/';
  res.json({ suggestions: suggestForPage(page) });
});

router.get('/knowledge', (_req, res) => {
  res.json({
    count: ALL_ENTRIES.length,
    topics: ALL_ENTRIES.map((e) => ({ id: e.id, topic: e.topic })),
  });
});

export default router;
