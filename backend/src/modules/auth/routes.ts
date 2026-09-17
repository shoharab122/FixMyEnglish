import { Router } from 'express';
import { z } from 'zod';
import { authLimiter } from '../../middleware/rateLimit.js';
import { validateBody } from '../../middleware/validate.js';
import { env } from '../../config/env.js';
import {
  REFRESH_COOKIE_NAME, register, login, guest, refresh, logout,
} from './service.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const guestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
});

function setRefreshCookie(res: any, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: env.refreshTtlDays * 86400_000,
    path: '/',
  });
}

function shapeUser(u: any) {
  return { id: u.id, name: u.name, email: u.email, tier: u.tier, role: u.role, avatarUrl: u.avatarUrl, xp: u.xp };
}

router.post('/register', authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] ?? undefined;
    const { user, accessToken, refreshToken } = await register(req.body.email, req.body.password, req.body.name, deviceInfo);
    setRefreshCookie(res, refreshToken);
    res.json({ user: shapeUser(user), accessToken });
  } catch (e) { next(e); }
});

router.post('/login', authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] ?? undefined;
    const { user, accessToken, refreshToken } = await login(req.body.email, req.body.password, deviceInfo);
    setRefreshCookie(res, refreshToken);
    res.json({ user: shapeUser(user), accessToken });
  } catch (e) { next(e); }
});

router.post('/guest', authLimiter, validateBody(guestSchema), async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] ?? undefined;
    const { user, accessToken, refreshToken } = await guest(req.body.name, req.body.email ?? '', deviceInfo);
    setRefreshCookie(res, refreshToken);
    res.json({ user: shapeUser(user), accessToken });
  } catch (e) { next(e); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const token = (req as any).cookies?.[REFRESH_COOKIE_NAME];
    const deviceInfo = req.headers['user-agent'] ?? undefined;
    const { user, accessToken, refreshToken } = await refresh(token, deviceInfo);
    setRefreshCookie(res, refreshToken);
    res.json({ user: shapeUser(user), accessToken });
  } catch (e) { next(e); }
});

router.post('/logout', async (req, res, next) => {
  try {
    await logout((req as any).cookies?.[REFRESH_COOKIE_NAME]);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
