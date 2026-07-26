import { describeWithInfra } from '../../../tests/helpers/skip-without-infra.helper';

/**
 * Opt-in integration scaffold (M9).
 * Requires TEST_DATABASE_URL and TEST_REDIS_URL — uses describe.skip when unset (intentional).
 * No Docker/Testcontainers. Does not open connections in the default path.
 */
describeWithInfra('infra connectivity (optional)', () => {
  it('should_see_test_database_and_redis_urls_when_enabled', () => {
    expect(process.env.TEST_DATABASE_URL).toMatch(/^mongodb(\+srv)?:\/\//);
    expect(process.env.TEST_REDIS_URL).toMatch(/^rediss?:\/\//);
  });
});
