import { randomUUID } from 'node:crypto';

/**
 * Deterministic-capable ID factory for tests.
 * Pass `seed` for stable ids in a single test; omit for unique values.
 */
export function createTestId(seed?: string): string {
  return seed ?? randomUUID();
}
