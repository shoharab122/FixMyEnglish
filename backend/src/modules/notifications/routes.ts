import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { verifyAccessToken } from '../../lib/jwt.js';

const router = Router();

function authOptional(req: any, _res: any, next: any) {
  try {
    const header = req.headers.authorization || '';
    const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (bearer) req.user = verifyAccessToken(bearer);
  } catch { /* anonymous */ }
  next();
}

router.get('/', authOptional, async (req: any, res, next) => {
  try {
    const items: any[] = [];

    if (req.user) {
      try {
        const badges = await prisma.userAchievement.findMany({
          where: { userId: req.user.id },
          take: 5,
          orderBy: { unlockedAt: 'desc' },
          include: { achievement: true },
        });
        for (const b of badges) {
          items.push({
            id: `badge-${b.id}`,
            kind: 'badge',
            title: '🏆 Badge earned!',
            body: b.achievement?.title ?? 'New badge',
            ts: b.unlockedAt?.toISOString?.() ?? new Date().toISOString(),
            read: false,
            to: '/progress',
          });
        }
      } catch { /* model may not exist */ }
    }

    try {
      const rooms = await prisma.liveRoom.findMany({
        where: { status: { in: ['scheduled', 'live'] } },
        orderBy: { scheduledAt: 'asc' },
        take: 3,
      });
      for (const r of rooms) {
        items.push({
          id: `live-${r.id}`,
          kind: 'live',
          title: r.status === 'live' ? '🔴 Live now' : '📅 Starting soon',
          body: r.title,
          ts: r.scheduledAt?.toISOString?.() ?? new Date().toISOString(),
          read: true,
          to: '/live-rooms',
        });
      }
    } catch { /* */ }

    try {
      const anns = await prisma.announcement.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      });
      for (const a of anns) {
        items.push({
          id: `ann-${a.id}`,
          kind: 'announcement',
          title: '📢 ' + (a.title || 'Announcement'),
          body: (a.body || '').slice(0, 100),
          ts: a.createdAt?.toISOString?.() ?? new Date().toISOString(),
          read: true,
          to: '/',
        });
      }
    } catch { /* */ }

    items.sort((a, b) => (b.ts > a.ts ? 1 : -1));
    const unread = items.filter((i) => !i.read).length;

    res.json({ items: items.slice(0, 12), unread });
  } catch (err) { next(err); }
});

export default router;
