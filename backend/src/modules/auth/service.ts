import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import {
  signAccessToken, signRefreshToken, verifyRefreshToken, hashToken,
} from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import { BadRequest, Unauthorized } from '../../lib/errors.js';

const REFRESH_COOKIE = 'ec_refresh';

// Compared against when the email is unknown, so "no such user" takes as long as "wrong password".
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const normEmail = (e: string) => e.trim().toLowerCase();

/** Case-insensitive lookup so accounts created before lowercasing still work. */
const findByEmail = (email: string) =>
  prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });

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
  const e = normEmail(email);
  if (await findByEmail(e)) throw BadRequest('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await prisma.user.create({ data: { email: e, passwordHash, name: name.trim(), tier: 'free' } });
  } catch (err: any) {
    if (err?.code === 'P2002') throw BadRequest('Email already registered'); // lost a sign-up race
    throw err;
  }
  await prisma.streak.create({ data: { userId: user.id } }).catch(() => { /* already exists */ });
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function login(email: string, password: string, deviceInfo?: string) {
  const user = await findByEmail(normEmail(email));
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !ok) throw Unauthorized('Invalid email or password');
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

/**
 * Guests ALWAYS get a brand-new account. Never reuse an existing user by email:
 * that would hand out tokens for a real account with no password check.
 * The email is kept only when nobody else owns it.
 */
export async function guest(name: string, email: string, deviceInfo?: string) {
  const e = email ? normEmail(email) : '';
  const taken = e ? await findByEmail(e) : null;

  const user = await prisma.user.create({
    data: { email: e && !taken ? e : null, name: name.trim(), tier: 'guest', isGuest: true },
  }).catch(async (err: any) => {
    if (err?.code !== 'P2002') throw err;
    // email got taken between the check and the insert: retry without it
    return prisma.user.create({ data: { email: null, name: name.trim(), tier: 'guest', isGuest: true } });
  });

  await prisma.streak.create({ data: { userId: user.id } }).catch(() => { /* already exists */ });
  const tokens = await issueTokens(user, deviceInfo);
  return { user, ...tokens };
}

export async function refresh(refreshToken: string, deviceInfo?: string) {
  if (!refreshToken) throw Unauthorized('No refresh token');
  let decoded;
  try { decoded = verifyRefreshToken(refreshToken); }
  catch { throw Unauthorized('Invalid refresh token'); }
  const hash = hashToken(refreshToken);
  // Atomic: only one concurrent refresh can consume this token
  const { count } = await prisma.refreshToken.deleteMany({
    where: { userId: decoded.id, tokenHash: hash, expiresAt: { gt: new Date() } },
  });
  if (count === 0) throw Unauthorized('Refresh token revoked');
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
