import 'dotenv/config';

const isProd = (process.env.NODE_ENV ?? '').toLowerCase() === 'production';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? (!isProd ? fallback : undefined);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv:         process.env.NODE_ENV ?? 'development',
  isProd,
  port:            Number(process.env.PORT ?? 4000),
  corsOrigin:      process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  appUrl:          process.env.APP_URL ?? 'http://localhost:5173',
  accessSecret:    required('JWT_ACCESS_SECRET',  'dev_access_secret_change_me_1234567890'),
  refreshSecret:   required('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me_1234567890'),
  accessTtl:       process.env.ACCESS_TTL ?? '15m',
  refreshTtlDays:  Number(process.env.REFRESH_TTL_DAYS ?? 30),
  speechProvider:  process.env.SPEECH_PROVIDER ?? 'mock',
  paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',

  // AI (GiMi). Missing key → falls back to the local knowledge base.
  aiProvider:      (process.env.AI_PROVIDER ?? 'mock') as 'openai' | 'anthropic' | 'mock',
  openaiApiKey:    process.env.OPENAI_API_KEY,
  openaiBaseUrl:   process.env.OPENAI_BASE_URL,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicBaseUrl:process.env.ANTHROPIC_BASE_URL,
  aiModel:         process.env.AI_MODEL,

  // Zoom Meeting SDK (optional). Missing → /zoom returns the plain join URL.
  zoomSdkKey:      process.env.ZOOM_SDK_KEY,
  zoomSdkSecret:   process.env.ZOOM_SDK_SECRET,
};
