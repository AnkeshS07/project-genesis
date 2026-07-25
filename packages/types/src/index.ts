/**
 * Shared type placeholders. Domain types are added in later epics.
 */
export type WorkspaceId = string;

export interface HealthStatus {
  readonly status: 'ok' | 'degraded' | 'down';
}
