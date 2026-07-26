import type { JobsOptions } from 'bullmq';
import type { QueueName } from './queues.constants';

/** Generic job envelope — no domain payloads in M7. */
export type InfrastructureJobData = {
  readonly kind: 'infrastructure';
  readonly message?: string;
  readonly correlationId?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type EnqueueOptions = JobsOptions;

export type RegisteredQueueInfo = {
  readonly name: QueueName;
};
