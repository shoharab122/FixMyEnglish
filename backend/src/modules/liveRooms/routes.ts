import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/', optionalAuth, async (_req, res, next) => {
  try {
    const rooms = await prisma.liveRoom.findMany({ orderBy: { scheduledAt: 'asc' }, take: 30 });
    res.json(rooms.map((r) => {
      const joined = 0;
      const startsIn = r.status === 'live'
        ? 'Live now'
        : r.scheduledAt
          ? `${Math.max(1, Math.round((r.scheduledAt.getTime() - Date.now()) / 60000))} min`
          : '—';
      return {
        id: r.id, title: r.title, seats: r.maxSeats, joined,
        startsIn, level: r.level, duration: `${r.durationMins} min`,
        live: r.status === 'live',
      };
    }));
  } catch (e) { next(e); }
});

router.post('/:roomId/join', optionalAuth, async (req, res, next) => {
  try {
    const room = await prisma.liveRoom.findUnique({ where: { id: req.params.roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const guestName = req.body?.name ?? req.body?.guestName ?? null;
    const guestEmail = req.body?.email ?? req.body?.guestEmail ?? null;
    const participant = await prisma.liveRoomParticipant.create({
      data: {
        roomId: room.id, userId: req.user?.id ?? null,
        guestName, guestEmail,
        questionOrderSeed: Math.floor(Math.random() * 2 ** 31),
      },
    });
    res.json({
      participantId: participant.id,
      participantToken: participant.id,
      roomId: room.id,
      questionOrderSeed: participant.questionOrderSeed,
    });
  } catch (e) { next(e); }
});

router.get('/:roomId/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const rows = await prisma.liveRoomResult.findMany({
      where: { roomId: req.params.roomId },
      include: { participant: true },
      orderBy: { score: 'desc' }, take: 20,
    });
    res.json(rows.map((r, i) => ({
      rank: i + 1,
      name: r.participant.guestName ?? r.participant.userId ?? 'Guest',
      score: r.score,
    })));
  } catch (e) { next(e); }
});

router.get('/:roomId/zoom', requireAuth, async (req, res, next) => {
  try {
    const room = await prisma.liveRoom.findUnique({ where: { id: req.params.roomId } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({
      joinUrl: 'https://zoom.us/j/0000000000?pwd=demo',
      meetingNumber: '0000000000',
      password: 'demo',
      userName: req.user!.name,
      userEmail: 'guest@example.com',
      role: 0,
    });
  } catch (e) { next(e); }
});

export default router;
