/**
 * Shared env fixture for Nest config / Zod validation tests.
 */
export const testEnvFixture = {
  NODE_ENV: 'test',
  PORT: '3001',
  DATABASE_URL: 'mongodb://localhost:27017/project-genesis-test',
  REDIS_URL: 'redis://localhost:6379/15',
  JWT_SECRET: 'test-jwt-secret-minimum-32-characters!',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  AUTH_REFRESH_COOKIE_NAME: 'refresh_token',
  AUTH_REFRESH_COOKIE_PATH: '/api/v1/auth',
  AUTH_COOKIE_SAMESITE: 'lax',
  AUTH_PASSWORD_RESET_EXPIRES_IN: '1h',
} as const;
