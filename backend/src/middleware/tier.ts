import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { PaymentRequired, Unauthorized } from '../lib/errors.js';
import { uid } from '../lib/req.js';

type Tier = 'guest' | 'free' | 'premium';
const RANK: Record<Tier, number> = { guest: 0, free: 1, premium: 2 };

// Reads the tier from the DB on every call, so an upgrade/downgrade applies
// immediately instead of waiting up to 15 minutes for the JWT to expire.
export function requireTier(min: Tier) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const row = await prisma.user.findUnique({
        where: { id: uid(req) }, select: { tier: true },
      });
      if (!row) return next(Unauthorized('User no longer exists'));

      const tier: Tier = (row.tier as string) in RANK ? (row.tier as Tier) : 'guest';
      (req as unknown as { user: { tier?: string } }).user.tier = tier;

      if (RANK[tier] < RANK[min]) {
        return next(
          PaymentRequired(`This needs a ${min} account`, {
            requiredTier: min, currentTier: tier, upgradeUrl: '/pricing',
          }),
        );
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
