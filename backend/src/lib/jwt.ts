import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export interface AccessPayload {
  id: string;
  name: string;
  tier: 'guest' | 'free' | 'premium';
}

export function signAccessToken(user: { id: string; name: string; tier: string }): string {
  return jwt.sign(
    { id: user.id, name: user.name, tier: user.tier },
    env.accessSecret,
    { expiresIn: env.accessTtl }
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.accessSecret) as AccessPayload;
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ id: userId, jti: crypto.randomUUID() }, env.refreshSecret, {
    expiresIn: `${env.refreshTtlDays}d`,
  });
}

export function verifyRefreshToken(token: string): { id: string; jti: string } {
  return jwt.verify(token, env.refreshSecret) as { id: string; jti: string };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
