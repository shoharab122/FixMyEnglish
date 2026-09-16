import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/rooms', optionalAuth, async (_req, res, next) => {
  try {
    const rooms = await prisma.chatRoom.findMany();
    res.json(rooms.map((r) => ({
      id: r.slug, name: r.name, minRank: r.minRank,
      locked: r.isLocked, live: r.liveCount, topic: r.topic,
    })));
  } catch (e) { next(e); }
});

router.get('/rooms/:roomId/threads', optionalAuth, async (req, res, next) => {
  try {
    const threads = await prisma.peerThread.findMany({
      where: { roomSlug: req.params.roomId },
      include: { _count: { select: { replies: true } }, user: true },
      orderBy: { createdAt: 'desc' }, take: 50,
    });
    res.json(threads.map((t) => ({
      id: t.id, title: t.title, author: t.user.name, replies: t._count.replies,
    })));
  } catch (e) { next(e); }
});

router.post('/rooms/:roomId/threads', requireAuth, async (req, res, next) => {
  try {
    const { body } = req.body ?? {};
    if (!body) return res.status(400).json({ error: 'Body required' });
    const [title, ...rest] = String(body).split('\n');
    const thread = await prisma.peerThread.create({
      data: {
        roomSlug: req.params.roomId, userId: req.user!.id,
        title: title.slice(0, 200), body: rest.join('\n') || null,
      },
    });
    res.json({ id: thread.id, title: thread.title, author: req.user!.name, replies: 0 });
  } catch (e) { next(e); }
});

router.get('/squads', optionalAuth, async (_req, res, next) => {
  try {
    const squads = await prisma.studyGroup.findMany({ take: 30 });
    res.json(squads.map((s) => ({
      id: s.id, name: s.name, members: s.memberCount,
      groupXp: s.groupXpCurrent, goal: s.groupXpGoal, crest: s.crest,
    })));
  } catch (e) { next(e); }
});

router.post('/challenges', requireAuth, async (req, res, next) => {
  try {
    const { quizId, friendEmail } = req.body ?? {};
    const friend = await prisma.user.findUnique({ where: { email: friendEmail } });
    if (!friend) return res.status(404).json({ error: 'Friend not found' });
    const c = await prisma.friendChallenge.create({
      data: { fromUserId: req.user!.id, toUserId: friend.id, quizRef: quizId ?? null },
    });
    res.json({ id: c.id, status: c.status });
  } catch (e) { next(e); }
});

export default router;
