import { prisma } from './prisma.js';
import { log } from './logger.js';
import { dayStart, daysBetween } from './time.js';
import { emitToUser, emitAll } from './realtime.js';

export const DAILY_GOAL = 100;

export function rankNameFor(xp: number): string {
  if (xp >= 2500) return 'Legend';
  if (xp >= 1000) return 'Champion';
  if (xp >= 400) return 'Tree';
  if (xp >= 150) return 'Sprout';
  return 'Seedling';
}

/* ------------------------------------------------------------------ */
/* Badges. Titles match the frontend's DEFAULT_BADGES.                 */
/* `sources` limits when the (possibly expensive) test runs.           */
/* ------------------------------------------------------------------ */
interface BadgeCtx {
  userId: string;
  source?: string;
  streak: number;
  totalXp: number;
  meta: { band?: number };
}

interface BadgeDef {
  code: string;
  title: string;
  icon: string;
  description: string;
  sources?: string[];
  test: (c: BadgeCtx) => boolean | Promise<boolean>;
}

const BADGES: BadgeDef[] = [
  {
    code: 'first-steps', title: 'First Steps', icon: '🌱', description: 'Earn your first XP',
    test: (c) => c.totalXp > 0,
  },
  {
    code: 'words-50', title: '50 Words Mastered', icon: '★', description: 'Learn 50 new words', sources: ['vocab'],
    test: async (c) =>
      (await prisma.vocabProgress.count({ where: { userId: c.userId, srsStage: { gte: 2 } } })) >= 50,
  },
  {
    code: 'streak-7', title: '7-Day Streak', icon: '🔥', description: 'Practise 7 days in a row',
    test: (c) => c.streak >= 7,
  },
  {
    code: 'grammar-guru', title: 'Grammar Guru', icon: '✓', description: 'Score 90% on 20 exercises', sources: ['grammar'],
    test: async (c) => {
      const [total, correct] = await Promise.all([
        prisma.grammarAttempt.count({ where: { userId: c.userId } }),
        prisma.grammarAttempt.count({ where: { userId: c.userId, isCorrect: true } }),
      ]);
      return total >= 20 && correct / total >= 0.9;
    },
  },
  {
    code: 'first-mock-exam', title: 'First Mock Exam', icon: '🎯', description: 'Complete any full mock', sources: ['exam'],
    test: () => true,
  },
  {
    code: 'speaking-star', title: 'Speaking Star', icon: '✦', description: 'Get a Band 7 on speaking', sources: ['speaking'],
    test: (c) => (c.meta.band ?? 0) >= 7,
  },
  {
    code: 'streak-30', title: '30-Day Streak', icon: '⚡', description: 'Practise 30 days in a row',
    test: (c) => c.streak >= 30,
  },
];

export const BADGE_ORDER: string[] = BADGES.map((b) => b.title);

let achievementsReady: Promise<Map<string, string>> | null = null;

/** Make sure every badge exists in the DB; returns Map<title, id>. */
export function ensureAchievements(): Promise<Map<string, string>> {
  achievementsReady ??= (async () => {
    const existing = await prisma.achievement.findMany();
    const byTitle = new Map<string, string>(existing.map((a) => [a.title, a.id]));
    const byCode = new Map<string, string>(existing.map((a) => [a.code, a.id]));
    for (const b of BADGES) {
      const found = byTitle.get(b.title) ?? byCode.get(b.code);
      if (found) {
        byTitle.set(b.title, found);
        continue;
      }
      const row = await prisma.achievement.create({
        data: { code: b.code, title: b.title, icon: b.icon, description: b.description },
      });
      byTitle.set(b.title, row.id);
    }
    return byTitle;
  })().catch((e: unknown) => {
    achievementsReady = null;
    throw e;
  });
  return achievementsReady;
}

export interface UnlockedBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: true;
}

/** Unlock any badges the user now qualifies for. Returns the new ones. */
export async function checkAchievements(ctx: BadgeCtx): Promise<UnlockedBadge[]> {
  const ids = await ensureAchievements();
  const mine = await prisma.userAchievement.findMany({
    where: { userId: ctx.userId }, select: { achievementId: true },
  });
  const have = new Set<string>(mine.map((m) => m.achievementId));
  const unlocked: UnlockedBadge[] = [];

  for (const b of BADGES) {
    const id = ids.get(b.title);
    if (!id || have.has(id)) continue;
    if (b.sources && !(ctx.source && b.sources.includes(ctx.source))) continue;

    let ok = false;
    try {
      ok = await b.test(ctx);
    } catch (e) {
      log.warn(`badge test failed: ${b.title}`, (e as Error)?.message);
    }
    if (!ok) continue;

    try {
      await prisma.userAchievement.create({ data: { userId: ctx.userId, achievementId: id } });
      unlocked.push({ id, name: b.title, icon: b.icon, description: b.description, unlocked: true });
    } catch {
      /* already unlocked by a concurrent request */
    }
  }
  return unlocked;
}

/* ------------------------------------------------------------------ */
/* Summary (same shape for REST and socket payloads)                   */
/* ------------------------------------------------------------------ */
export interface Summary {
  streak: number;
  longestStreak: number;
  freezeAvailable: boolean;
  xpToday: number;
  xpGoal: number;
  goalReached: boolean;
  rank: number;
  rankName: string;
  totalXp: number;
  tier: string;
}

export async function buildSummary(userId: string): Promise<Summary | null> {
  const today = dayStart();
  const [user, streakRow, daily, lastActive] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { xp: true, tier: true, name: true } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.userStatsDaily.findUnique({ where: { userId_date: { userId, date: today } } }),
    prisma.userStatsDaily.findFirst({ where: { userId }, orderBy: { date: 'desc' }, select: { date: true } }),
  ]);
  if (!user) return null;

  // Live rank = position by XP (ties share a rank).
  const rank = (await prisma.user.count({ where: { xp: { gt: user.xp } } })) + 1;

  // A stored streak is only "alive" if the user practised today/yesterday
  // (or missed exactly one day and still has a freeze).
  const freezeAvailable = streakRow?.freezeAvailable ?? true;
  const gap = lastActive ? daysBetween(lastActive.date, today) : null;
  const alive = gap !== null && (gap <= 1 || (gap === 2 && freezeAvailable));
  const streak = alive ? streakRow?.currentStreak ?? 0 : 0;
  const xpToday = daily?.xpEarned ?? 0;

  return {
    streak,
    longestStreak: Math.max(streakRow?.longestStreak ?? 0, streak),
    freezeAvailable,
    xpToday,
    xpGoal: DAILY_GOAL,
    goalReached: xpToday >= DAILY_GOAL,
    rank,
    rankName: rankNameFor(user.xp),
    totalXp: user.xp,
    tier: user.tier,
  };
}

/* ------------------------------------------------------------------ */
/* Leaderboard "something changed" ping, debounced to 1/sec            */
/* ------------------------------------------------------------------ */
let pingTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleLeaderboardPing(): void {
  if (pingTimer) return;
  pingTimer = setTimeout(() => {
    pingTimer = null;
    emitAll('leaderboard:dirty', { ts: Date.now() });
  }, 1000);
}

/* ------------------------------------------------------------------ */
/* The one function every feature calls to give XP                     */
/* ------------------------------------------------------------------ */
export interface AwardOpts {
  /** 'grammar' | 'vocab' | 'speaking' | 'exam' */
  source: string;
  answered?: number;
  minutes?: number;
  meta?: { band?: number };
}

export interface AwardResult {
  summary: Summary;
  unlocked: UnlockedBadge[];
  xpGained: number;
}

/** amount may be 0: the activity still counts toward the daily streak. */
export async function awardXp(userId: string, amount: number, opts: AwardOpts): Promise<AwardResult> {
  const { source, answered = 1, minutes = 0, meta = {} } = opts;
  const xp = Math.max(0, Math.floor(amount));
  const today = dayStart();

  await prisma.$transaction(async (tx) => {
    // Atomic "first activity today?" check: only one request can insert the row.
    const created = await tx.userStatsDaily.createMany({
      data: [{ userId, date: today, xpEarned: xp, questionsAnswered: answered, minutesActive: minutes }],
      skipDuplicates: true,
    });
    const firstToday = created.count === 1;

    if (!firstToday) {
      await tx.userStatsDaily.update({
        where: { userId_date: { userId, date: today } },
        data: {
          xpEarned: { increment: xp },
          questionsAnswered: { increment: answered },
          minutesActive: { increment: minutes },
        },
      });
    }

    await tx.user.update({ where: { id: userId }, data: { xp: { increment: xp } } });

    if (firstToday) {
      const streak = await tx.streak.findUnique({ where: { userId } });
      const prev = await tx.userStatsDaily.findFirst({
        where: { userId, date: { lt: today } }, orderBy: { date: 'desc' }, select: { date: true },
      });
      const gap = prev ? daysBetween(prev.date, today) : null;
      const freeze = streak?.freezeAvailable ?? true;
      const before = streak?.currentStreak ?? 0;

      let current: number;
      let usedFreeze = false;
      if (gap === 0) current = before || 1; // legacy same-day row
      else if (gap === 1) current = before + 1; // consecutive day
      else if (gap === 2 && freeze) { current = before + 1; usedFreeze = true; } // saved by freeze
      else current = 1; // streak broken / first ever

      const longest = Math.max(streak?.longestStreak ?? 0, current);
      const freezeAvailable = usedFreeze ? false : current % 7 === 0 ? true : freeze;

      await tx.streak.upsert({
        where: { userId },
        create: { userId, currentStreak: current, longestStreak: longest, freezeAvailable },
        update: { currentStreak: current, longestStreak: longest, freezeAvailable },
      });
    }
  });

  const summary = (await buildSummary(userId))!;
  let unlocked: UnlockedBadge[] = [];
  try {
    unlocked = await checkAchievements({
      userId, source, meta, streak: summary.streak, totalXp: summary.totalXp,
    });
  } catch (e) {
    log.warn('achievement check failed', (e as Error)?.message); // never block XP on badges
  }

  // ---- realtime pushes ----
  emitToUser(userId, 'gamification:update', { ...summary, gained: xp, source });
  if (unlocked.length) emitToUser(userId, 'gamification:badge_unlocked', unlocked);
  if (summary.xpToday >= DAILY_GOAL && summary.xpToday - xp < DAILY_GOAL) {
    emitToUser(userId, 'gamification:goal_reached', { xpToday: summary.xpToday, xpGoal: DAILY_GOAL });
  }
  if (xp > 0) scheduleLeaderboardPing();

  return { summary, unlocked, xpGained: xp };
}

/** Change a user's tier and tell all their open tabs immediately. */
export async function setUserTier(userId: string, tier: 'guest' | 'free' | 'premium'): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.user.update({ where: { id: userId }, data: { tier: tier as any } });
  emitToUser(userId, 'user:update', { tier });
}
