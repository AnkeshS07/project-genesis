/**
 * Shared env fixture for Nest config / Zod validation tests.
 */
export const testEnvFixture = {
  NODE_ENV: 'test',
  PORT: '3001',
  DATABASE_URL: 'mongodb://localhost:27017/project-genesis-test',
  REDIS_URL: 'redis://localhost:6379/15',
} as const;
