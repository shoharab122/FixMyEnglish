import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { buildSummary, ensureAchievements, BADGE_ORDER } from '../../lib/gamification.js';
import { NotFound } from '../../lib/errors.js';
import { uid, optUid } from '../../lib/req.js';

const router = Router();

router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const summary = await buildSummary(uid(req));
    if (!summary) return next(NotFound('User not found'));
    res.json(summary);
  } catch (e) {
    next(e);
  }
});

router.get('/badges', requireAuth, async (req, res, next) => {
  try {
    await ensureAchievements(); // the list is never empty, so no fake fallback badges
    const [all, mine] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { userId: uid(req) }, select: { achievementId: true } }),
    ]);
    const unlockedIds = new Set<string>(mine.map((m) => m.achievementId));
    const order = (t: string): number => {
      const i = BADGE_ORDER.indexOf(t);
      return i === -1 ? 999 : i;
    };
    res.json(
      [...all]
        .sort((a, b) => order(a.title) - order(b.title))
        .map((a) => ({
          id: a.id, name: a.title, icon: a.icon,
          description: a.description, unlocked: unlockedIds.has(a.id),
        })),
    );
  } catch (e) {
    next(e);
  }
});

router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const me = optUid(req);
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' }, take: 10, select: { id: true, name: true, xp: true },
    });
    res.json(users.map((u, i) => ({
      rank: i + 1, name: u.name, xp: u.xp, me: u.id === me,
    })));
  } catch (e) {
    next(e);
  }
});

export default router;
