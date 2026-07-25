/**
 * Injection tokens for database infrastructure (Epic 00 / M5).
 * Prefer RedisService for now; REDIS_CLIENT reserved for future injectors (e.g. M7 BullMQ).
 */
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
