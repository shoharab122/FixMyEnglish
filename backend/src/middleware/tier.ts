import type { Request, Response, NextFunction } from 'express';
import { PaymentRequired } from '../lib/errors.js';

const RANK = { guest: 0, free: 1, premium: 2 } as const;

export function requireTier(min: 'guest' | 'free' | 'premium') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const tier = (req.user?.tier ?? 'guest') as keyof typeof RANK;
    if (RANK[tier] < RANK[min]) {
      return next(PaymentRequired(
        `This needs a ${min} account`,
        { requiredTier: min, currentTier: tier, upgradeUrl: '/pricing' }
      ));
    }
    next();
  };
}
