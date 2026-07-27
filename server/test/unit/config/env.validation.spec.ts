import { validateEnv } from '../../../src/config/env.validation';
import { testEnvFixture } from '../../../../tests/fixtures/env.fixture';

describe('validateEnv', () => {
  it('should_accept_valid_bootstrap_env', () => {
    const env = validateEnv({ ...testEnvFixture });
    expect(env.PORT).toBe(3001);
    expect(env.DATABASE_URL).toContain('mongodb://');
    expect(env.REDIS_URL).toContain('redis://');
  });

  it('should_reject_missing_database_url', () => {
    expect(() =>
      validateEnv({
        NODE_ENV: 'test',
        PORT: '3001',
        REDIS_URL: 'redis://localhost:6379',
        JWT_SECRET: 'test-jwt-secret-minimum-32-characters!',
      }),
    ).toThrow(/DATABASE_URL/);
  });

  it('should_reject_invalid_redis_scheme', () => {
    expect(() =>
      validateEnv({
        ...testEnvFixture,
        REDIS_URL: 'http://localhost:6379',
      }),
    ).toThrow(/REDIS_URL/);
  });
});
