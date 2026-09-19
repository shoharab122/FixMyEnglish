import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/error.js';

import authRoutes        from './modules/auth/routes.js';
import usersRoutes       from './modules/users/routes.js';
import vocabRoutes       from './modules/vocab/routes.js';
import grammarRoutes     from './modules/grammar/routes.js';
import curriculumRoutes  from './modules/curriculum/routes.js';
import examsRoutes       from './modules/exams/routes.js';
import speakingRoutes    from './modules/speaking/routes.js';
import gamificationRoutes from './modules/gamification/routes.js';
import communityRoutes   from './modules/community/routes.js';
import liveRoomsRoutes   from './modules/liveRooms/routes.js';
import paymentsRoutes    from './modules/payments/routes.js';
import adminRoutes       from './modules/admin/routes.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (!env.isProd) app.use(morgan('dev'));
  app.use(globalLimiter);

  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

  app.use('/api/auth',         authRoutes);
  app.use('/api/users',        usersRoutes);
  app.use('/api/vocab',        vocabRoutes);
  app.use('/api/grammar',      grammarRoutes);
  app.use('/api/curriculum',   curriculumRoutes);
  app.use('/api/exams',        examsRoutes);
  app.use('/api/speaking',     speakingRoutes);
  app.use('/api/gamification', gamificationRoutes);
  app.use('/api/community',    communityRoutes);
  app.use('/api/live-rooms',   liveRoomsRoutes);
  app.use('/api/payments',     paymentsRoutes);
  app.use('/api/admin',        adminRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
