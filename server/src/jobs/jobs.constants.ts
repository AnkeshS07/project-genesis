/**
 * Job name constants for future epics.
 * M7 registers the registry structure only — no business job types are active.
 */
export const JOB_NAMES = {
  /** Placeholder ping job name — not enqueued by the application in M7. */
  SYSTEM_PING: 'system.ping',
} as const;

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];

export type JobDefinition = {
  readonly name: JobName | string;
  readonly description: string;
  readonly implemented: boolean;
};
