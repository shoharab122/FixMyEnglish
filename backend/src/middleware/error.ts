import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/errors.js';
import { log } from '../lib/logger.js';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'Route not found'));
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.payload ?? {}),
    });
  }
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation failed', issues: err.issues });
  }
  log.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
