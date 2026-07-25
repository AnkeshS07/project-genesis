import type { HealthStatus } from '@project-genesis/types';

/** Application display name (non-secret constant). */
export const APP_NAME = 'Project Genesis' as const;

/**
 * Minimal shared helper placeholder.
 * Real validators/utilities are added in later milestones/epics.
 */
export function createOkHealthStatus(): HealthStatus {
  return { status: 'ok' };
}
