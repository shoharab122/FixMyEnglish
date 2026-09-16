import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { streak: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      tier: user.tier,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      rank: user.rank,
      streak: user.streak?.currentStreak ?? 0,
    });
  } catch (e) { next(e); }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { name, avatarUrl } = req.body ?? {};
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(typeof name === 'string' ? { name } : {}),
        ...(typeof avatarUrl === 'string' ? { avatarUrl } : {}),
      },
    });
    res.json({ id: user.id, name: user.name, tier: user.tier, avatarUrl: user.avatarUrl });
  } catch (e) { next(e); }
});

export default router;
