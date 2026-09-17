import type { Request, Response, NextFunction } from 'express';
import { Forbidden } from '../lib/errors.js';

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return next(Forbidden('Admin access required'));
  }
  next();
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  const role = req.user?.role;
  if (role !== 'superadmin') {
    return next(Forbidden('Superadmin access required'));
  }
  next();
}
