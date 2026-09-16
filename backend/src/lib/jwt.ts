import jwt, { type SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export interface AccessPayload {
  id: string;
  name: string;
  tier: 'guest' | 'free' | 'premium';
}

export function signAccessToken(user: { id: string; name: string; tier: string }): string {
  const options: SignOptions = { expiresIn: env.accessTtl as any };
  return jwt.sign(
    { id: user.id, name: user.name, tier: user.tier },
    env.accessSecret,
    options
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.accessSecret) as AccessPayload;
}

export function signRefreshToken(userId: string): string {
  const options: SignOptions = { expiresIn: `${env.refreshTtlDays}d` as any };
  return jwt.sign({ id: userId, jti: crypto.randomUUID() }, env.refreshSecret, options);
}

export function verifyRefreshToken(token: string): { id: string; jti: string } {
  return jwt.verify(token, env.refreshSecret) as { id: string; jti: string };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
