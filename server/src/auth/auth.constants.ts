/**
 * Epic 01 M2 — auth core constants (no HTTP).
 */

/** Opaque refresh token entropy (bytes). */
export const REFRESH_TOKEN_BYTES = 32;

/** Default max concurrent active sessions per user (FIFO eviction). */
export const DEFAULT_MAX_ACTIVE_SESSIONS = 10;

/** OWASP-aligned Argon2id defaults (memory in KiB). */
export const DEFAULT_ARGON2_MEMORY_KIB = 19_456;
export const DEFAULT_ARGON2_TIME_COST = 2;
export const DEFAULT_ARGON2_PARALLELISM = 1;

export const AUTH_MAX_ACTIVE_SESSIONS = Symbol('AUTH_MAX_ACTIVE_SESSIONS');
export const ARGON2_OPTIONS = Symbol('ARGON2_OPTIONS');
