import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

const router = Router();

function rankNameFor(xp: number) {
  if (xp >= 2500) return 'Legend';
  if (xp >= 1000) return 'Champion';
  if (xp >= 400)  return 'Tree';
  if (xp >= 150)  return 'Sprout';
  return 'Seedling';
}

router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [daily, user, streak] = await Promise.all([
      prisma.userStatsDaily.findUnique({ where: { userId_date: { userId: req.user!.id, date: today } } }),
      prisma.user.findUnique({ where: { id: req.user!.id } }),
      prisma.streak.findUnique({ where: { userId: req.user!.id } }),
    ]);
    const xpToday = daily?.xpEarned ?? 0;
    res.json({
      streak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      freezeAvailable: streak?.freezeAvailable ?? true,
      xpToday, xpGoal: 100,
      rank: user?.rank ?? 0,
      rankName: rankNameFor(user?.xp ?? 0),
      totalXp: user?.xp ?? 0,
    });
  } catch (e) { next(e); }
});

router.get('/badges', requireAuth, async (req, res, next) => {
  try {
    const [all, mine] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { userId: req.user!.id } }),
    ]);
    const unlockedIds = new Set(mine.map((m) => m.achievementId));
    res.json(all.map((a) => ({
      id: a.id, name: a.title, icon: a.icon,
      description: a.description, unlocked: unlockedIds.has(a.id),
    })));
  } catch (e) { next(e); }
});

router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { xp: 'desc' }, take: 10 });
    res.json(users.map((u, i) => ({
      rank: i + 1, name: u.name, xp: u.xp, me: u.id === req.user?.id,
    })));
  } catch (e) { next(e); }
});

export default router;
