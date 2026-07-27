import { existsSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const jwtDurationSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^\d+[smhd]$/i, 'must be a duration like 15m, 7d, 3600s');

/**
 * Environment schema — API + Mongo + Redis + JWT + auth core tuning (Epic 01 M2).
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL is required' })
    .min(1)
    .refine(
      (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'DATABASE_URL must be a mongodb:// or mongodb+srv:// URI',
    ),
  REDIS_URL: z
    .string({ required_error: 'REDIS_URL is required' })
    .min(1)
    .refine(
      (value) => value.startsWith('redis://') || value.startsWith('rediss://'),
      'REDIS_URL must be a redis:// or rediss:// URI',
    ),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET is required' })
    .min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: jwtDurationSchema.default('15m'),
  JWT_REFRESH_EXPIRES_IN: jwtDurationSchema.default('7d'),
  AUTH_MAX_ACTIVE_SESSIONS: z.coerce.number().int().positive().max(100).default(10),
  AUTH_ARGON2_MEMORY_KIB: z.coerce.number().int().positive().default(19_456),
  AUTH_ARGON2_TIME_COST: z.coerce.number().int().positive().default(2),
  AUTH_ARGON2_PARALLELISM: z.coerce.number().int().positive().default(1),
  AUTH_REFRESH_COOKIE_NAME: z.string().trim().min(1).default('refresh_token'),
  AUTH_REFRESH_COOKIE_PATH: z.string().trim().min(1).default('/api/v1/auth'),
  AUTH_COOKIE_SAMESITE: z.enum(['strict', 'lax', 'none']).default('lax'),
  AUTH_PASSWORD_RESET_EXPIRES_IN: jwtDurationSchema.default('1h'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return parsed.data;
}

/**
 * Resolve `.env` from package cwd or monorepo root when the server is started via pnpm filter.
 */
export function resolveEnvFilePaths(): string[] {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
    path.resolve(__dirname, '../../../.env'),
  ];

  return [...new Set(candidates.filter((candidate) => existsSync(candidate)))];
}
