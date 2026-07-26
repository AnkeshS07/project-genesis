/**
 * Opt-in integration gating (M9).
 * No Docker/Testcontainers — suites skip cleanly when TEST_* URLs are absent.
 */

export function hasTestDatabaseUrl(): boolean {
  return Boolean(process.env.TEST_DATABASE_URL?.trim());
}

export function hasTestRedisUrl(): boolean {
  return Boolean(process.env.TEST_REDIS_URL?.trim());
}

/**
 * Jest helper: skip the suite when required TEST_* URLs are not set.
 * Intentional `describe.skip` — not an abandoned test.
 */
export function describeWithInfra(
  name: string,
  fn: () => void,
  options: { database?: boolean; redis?: boolean } = { database: true, redis: true },
): void {
  const needDb = options.database !== false;
  const needRedis = options.redis !== false;
  const ready = (!needDb || hasTestDatabaseUrl()) && (!needRedis || hasTestRedisUrl());

  const runner = ready ? describe : describe.skip;
  runner(name, fn);
}
