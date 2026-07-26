/**
 * Injection tokens for database infrastructure (Epic 00 / M5).
 * Prefer RedisService for API health/ping.
 * BullMQ uses dedicated connections via QueuesModule / WorkersModule (M7).
 */
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
