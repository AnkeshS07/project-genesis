import type { Job } from 'bullmq';
import {
  runWithCorrelation,
  type CorrelationStore,
} from '../telemetry/correlation/correlation.context';

type JobDataWithCorrelation = {
  readonly correlationId?: string;
};

/**
 * Binds BullMQ job identity into AsyncLocalStorage for structured logs/metrics.
 */
export function runWithWorkerJobContext<T>(job: Job, fn: () => T): T {
  const data = (job.data ?? {}) as JobDataWithCorrelation;
  const store: CorrelationStore = {
    service: 'worker',
    queueName: job.queueName,
    jobName: job.name,
    ...(job.id !== undefined ? { jobId: String(job.id) } : {}),
    ...(data.correlationId
      ? { correlationId: data.correlationId }
      : job.id !== undefined
        ? { correlationId: String(job.id) }
        : {}),
  };

  return runWithCorrelation(store, fn);
}
