import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

function isAdmin(req: any) { return req.user?.tier === 'premium'; }

router.get('/activity-logs', requireAuth, async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'Admin only' });
  res.json([]);
});

router.get('/analytics', requireAuth, async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Admin only' });
    const [users, purchases, xpToday] = await Promise.all([
      prisma.user.count(),
      prisma.purchase.count({ where: { status: 'paid' } }),
      prisma.userStatsDaily.aggregate({ _sum: { xpEarned: true } }),
    ]);
    res.json({ users, paidPurchases: purchases, xpToday: xpToday._sum.xpEarned ?? 0 });
  } catch (e) { next(e); }
});

router.get('/purchases', requireAuth, async (req, res, next) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ error: 'Admin only' });
    const rows = await prisma.purchase.findMany({ include: { product: true, user: true }, take: 100 });
    res.json(rows);
  } catch (e) { next(e); }
});

export default router;
