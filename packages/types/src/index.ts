/**
 * Shared type placeholders. Domain types land in later epics.
 * `WorkspaceId` is reserved for Epic 03 (Workspaces) — not used in bootstrap APIs.
 */
export type WorkspaceId = string;

export interface HealthStatus {
  readonly status: 'ok' | 'degraded' | 'down';
}
