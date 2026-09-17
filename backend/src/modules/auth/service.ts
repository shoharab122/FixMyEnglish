import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import {
  signAccessToken, signRefreshToken, verifyRefreshToken, hashToken,
} from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import { BadRequest, Unauthorized } from '../../lib/errors.js';

const REFRESH_COOKIE = 'ec_refresh';

export async function issueTokens(user: { id: string; name: string; tier: string; role?: string }, deviceInfo?: string) {
  const accessToken = signAccessToken({ id: user.id, name: user.name, tier: user.tier, role: (user as any).role });
  const refreshToken = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      deviceInfo: deviceInfo ?? null,
      expiresAt: new Date(Date.now() + env.refreshTtlDays * 86400_000),
    },
  });
  return { accessToken, refreshToken };
}

export async function register(email: string, password: string, name: string, deviceInfo?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw BadRequest('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name, tier: 'free' } });
  await prisma.streak.create({ data: { userId: user.id } });
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function login(email: string, password: string, deviceInfo?: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw Unauthorized('Invalid email or password');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Unauthorized('Invalid email or password');
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function guest(name: string, email: string, deviceInfo?: string) {
  let user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user) {
    user = await prisma.user.create({
      data: { email: email || null, name, tier: 'guest', isGuest: true },
    });
    await prisma.streak.create({ data: { userId: user.id } });
  }
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function refresh(refreshToken: string, deviceInfo?: string) {
  if (!refreshToken) throw Unauthorized('No refresh token');
  let decoded;
  try { decoded = verifyRefreshToken(refreshToken); }
  catch { throw Unauthorized('Invalid refresh token'); }
  const hash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { userId: decoded.id, tokenHash: hash, expiresAt: { gt: new Date() } },
  });
  if (!stored) throw Unauthorized('Refresh token revoked');
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) throw Unauthorized('User no longer exists');
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function logout(refreshToken?: string) {
  if (!refreshToken) return;
  const hash = hashToken(refreshToken);
  await prisma.refreshToken.deleteMany({ where: { tokenHash: hash } });
}

export const REFRESH_COOKIE_NAME = REFRESH_COOKIE;
