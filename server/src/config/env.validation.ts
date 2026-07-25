import { existsSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/**
 * M5 environment schema — API process + MongoDB + Redis.
 * JWT / AI / storage secrets remain deferred to later milestones.
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
