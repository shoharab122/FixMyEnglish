// Day boundaries are computed in Asia/Dhaka (UTC+6, no DST) so streaks and
// daily stats don't shift with the server's timezone.
const TZ_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 86_400_000;

/** Midnight (as a UTC Date) of the Dhaka calendar day containing `now`. */
export function dayStart(now: Date = new Date()): Date {
  const d = new Date(now.getTime() + TZ_OFFSET_MS);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Whole calendar days from a to b (b later => positive). */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((dayStart(b).getTime() - dayStart(a).getTime()) / DAY_MS);
}
