import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv:         process.env.NODE_ENV ?? 'development',
  port:            Number(process.env.PORT ?? 4000),
  corsOrigin:      process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  appUrl:          process.env.APP_URL ?? 'http://localhost:5173',
  accessSecret:    required('JWT_ACCESS_SECRET', 'dev_access_secret_change_me_1234567890'),
  refreshSecret:   required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me_1234567890'),
  accessTtl:       process.env.ACCESS_TTL ?? '15m',
  refreshTtlDays:  Number(process.env.REFRESH_TTL_DAYS ?? 30),
  speechProvider:  process.env.SPEECH_PROVIDER ?? 'mock',
  paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',
  isProd:          process.env.NODE_ENV === 'production',
};
