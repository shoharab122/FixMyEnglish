import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt.js';
import { Unauthorized } from '../lib/errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; tier: 'guest' | 'free' | 'premium' };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(Unauthorized('No token'));
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(Unauthorized('Invalid or expired token'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try { req.user = verifyAccessToken(token); } catch { /* ignore */ }
  }
  next();
}
