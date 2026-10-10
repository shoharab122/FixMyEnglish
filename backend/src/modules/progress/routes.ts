import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { buildSummary, ensureAchievements, BADGE_ORDER } from '../../lib/gamification.js';
import { dayStart, daysBetween } from '../../lib/time.js';
import { uid, optUid } from '../../lib/req.js';

const router = Router();

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** One entry per day (oldest first). Days with no activity are zeros, so charts never have gaps. */
async function series(userId: string, days: number) {
  const today = dayStart();
  const from = new Date(today.getTime() - (days - 1) * 86400_000);
  const rows = await prisma.userStatsDaily.findMany({
    where: { userId, date: { gte: from } },
    orderBy: { date: 'asc' },
  });

  const out = Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getTime() - (days - 1 - i) * 86400_000);
    return {
      date: ymd(d),
      label: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      xp: 0, questions: 0, minutes: 0, active: false,
    };
  });

  for (const r of rows) {
    const idx = days - 1 - daysBetween(r.date, today);
    if (idx >= 0 && idx < days) {
      out[idx].xp = r.xpEarned;
      out[idx].questions = r.questionsAnswered;
      out[idx].minutes = r.minutesActive;
      out[idx].active = true;
    }
  }
  return out;
}

function totalsOf(list: { xp: number; questions: number; minutes: number; active: boolean }[]) {
  return list.reduce(
    (t, d) => ({
      xp: t.xp + d.xp,
      questions: t.questions + d.questions,
      minutes: t.minutes + d.minutes,
      activeDays: t.activeDays + (d.active ? 1 : 0),
    }),
    { xp: 0, questions: 0, minutes: 0, activeDays: 0 },
  );
}

async function badges(userId: string) {
  const ids = await ensureAchievements();
  const [defs, mine] = await Promise.all([
    prisma.achievement.findMany({ where: { id: { in: [...ids.values()] } } }),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true, unlockedAt: true } }),
  ]);
  const byTitle = new Map(defs.map((d) => [d.title, d]));
  const unlockedAt = new Map(mine.map((m) => [m.achievementId, m.unlockedAt]));

  return BADGE_ORDER.flatMap((title) => {
    const d = byTitle.get(title);
    if (!d) return [];
    const at = unlockedAt.get(d.id);
    return [{
      id: d.id, name: d.title, icon: d.icon, description: d.description,
      unlocked: !!at, unlockedAt: at ? at.toISOString() : null,
    }];
  });
}

/** Latest scored activity (speaking band x10, exam percent), newest first. */
async function recent(userId: string) {
  const [sp, ex] = await Promise.all([
    prisma.speakingAttempt.findMany({
      where: { userId }, orderBy: { createdAt: 'desc' }, take: 5,
      select: { id: true, overallBand: true, createdAt: true },
    }),
    prisma.examSession.findMany({
      where: { userId, submittedAt: { not: null } }, orderBy: { submittedAt: 'desc' }, take: 5,
      select: { id: true, finalScore: true, submittedAt: true },
    }),
  ]);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Dhaka' });
  return [
    ...sp.map((s) => ({
      id: `sp-${s.id}`, label: 'Speaking practice', icon: 'mic', date: fmt(s.createdAt), ts: s.createdAt.getTime(),
      score: Math.round(Math.min(10, Math.max(0, Number(s.overallBand ?? 0))) * 10),
    })),
    ...ex.filter((x) => x.finalScore != null && x.submittedAt).map((x) => ({
      id: `ex-${x.id}`, label: 'Exam', icon: 'flag', date: fmt(x.submittedAt as Date), ts: (x.submittedAt as Date).getTime(),
      score: Math.round(Math.min(100, Math.max(0, Number(x.finalScore)))),
    })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 5).map(({ ts, ...r }) => r);
}

/* ---------- everything the Progress page needs in one call ---------- */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);
    const [summary, week, list, recentList] = await Promise.all([buildSummary(userId), series(userId, 7), badges(userId), recent(userId)]);
    if (!summary) return res.status(404).json({ error: 'User not found' });
    const { xp, questions, minutes } = totalsOf(week);
    res.json({ summary, week, weekTotals: { xp, questions, minutes }, badges: list, recent: recentList, serverTime: new Date().toISOString() });
  } catch (e) {
    next(e);
  }
});

router.get('/weekly', requireAuth, async (req, res, next) => {
  try {
    const days = clampInt(req.query.days, 1, 30, 7);
    const list = await series(uid(req), days);
    const { xp, questions, minutes } = totalsOf(list);
    res.json({ days: list, totals: { xp, questions, minutes } });
  } catch (e) {
    next(e);
  }
});

/* ---------- day-to-day records ---------- */
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);
    const days = clampInt(req.query.days, 1, 365, 90);
    const [list, summary] = await Promise.all([series(userId, days), buildSummary(userId)]);

    const totals = totalsOf(list);
    const best = list.reduce((b, d) => (d.xp > b.xp ? d : b), list[0]);
    res.json({
      days: list,
      totals,
      bestDay: best && best.xp > 0 ? { date: best.date, xp: best.xp } : null,
      streak: summary ? { current: summary.streak, longest: summary.longestStreak } : null,
    });
  } catch (e) {
    next(e);
  }
});

/** One day in detail: the saved record plus what the user actually did that day. */
router.get('/day/:date', requireAuth, async (req, res, next) => {
  try {
    const userId = uid(req);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(req.params.date);
    if (!m) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });

    const dayKey = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    if (Number.isNaN(dayKey.getTime())) return res.status(400).json({ error: 'Invalid date' });
    const start = new Date(dayKey.getTime() - 6 * 3600_000); // Dhaka midnight in UTC
    const end = new Date(start.getTime() + 86400_000);

    const [record, grammar, speaking, exams] = await Promise.all([
      prisma.userStatsDaily.findFirst({ where: { userId, date: { gte: start, lt: end } } }),
      prisma.grammarAttempt.findMany({
        where: { userId, attemptedAt: { gte: start, lt: end } },
        select: { isCorrect: true },
      }),
      prisma.speakingAttempt.findMany({
        where: { userId, createdAt: { gte: start, lt: end } },
        select: { id: true, promptText: true, overallBand: true, durationSeconds: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.examSession.findMany({
        where: { userId, submittedAt: { gte: start, lt: end } },
        select: { id: true, finalScore: true },
        orderBy: { submittedAt: 'asc' },
      }),
    ]);

    res.json({
      date: req.params.date,
      xp: record?.xpEarned ?? 0,
      questions: record?.questionsAnswered ?? 0,
      minutes: record?.minutesActive ?? 0,
      active: !!record,
      activity: {
        grammar: { attempts: grammar.length, correct: grammar.filter((g) => g.isCorrect).length },
        speaking: speaking.map((s) => ({
          id: s.id, prompt: s.promptText, band: s.overallBand, seconds: s.durationSeconds,
        })),
        exams: exams.map((x) => ({ id: x.id, percent: x.finalScore })),
      },
    });
  } catch (e) {
    next(e);
  }
});

/* ---------- leaderboard ---------- */
router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const top = await prisma.user.findMany({
      where: { isGuest: false, xp: { gt: 0 } },
      orderBy: [{ xp: 'desc' }, { createdAt: 'asc' }],
      take: 20,
      select: { id: true, name: true, avatarUrl: true, xp: true },
    });
    const me = optUid(req);
    const mySummary = me ? await buildSummary(me) : null;
    res.json({
      top: top.map((u, i) => ({
        rank: i + 1, id: u.id, name: u.name, avatarUrl: u.avatarUrl, xp: u.xp, isMe: u.id === me,
      })),
      me: mySummary ? { rank: mySummary.rank, xp: mySummary.totalXp } : null,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
