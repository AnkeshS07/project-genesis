import { Inject, Injectable } from '@nestjs/common';
import type { Job, Processor } from 'bullmq';
import type { InfrastructureJobData } from '../queues/queue.types';
import { AppLogger } from '../telemetry/logging/app-logger.service';
import type { MetricsPort } from '../telemetry/metrics/metrics.interface';
import { INFRA_METRIC_NAMES, METRICS } from '../telemetry/telemetry.constants';
import { runWithWorkerJobContext } from './worker-log.context';

/**
 * Infrastructure-only processor.
 * Refuses every job — no business logic, no side effects.
 */
@Injectable()
export class InfrastructureProcessor {
  constructor(
    private readonly appLogger: AppLogger,
    @Inject(METRICS) private readonly metrics: MetricsPort,
  ) {}

  create(): Processor<InfrastructureJobData> {
    return async (job: Job<InfrastructureJobData>): Promise<void> => {
      await runWithWorkerJobContext(job, async () => {
        this.metrics.increment(INFRA_METRIC_NAMES.WORKER_JOBS_FAILED_TOTAL, 1, {
          queue: job.queueName,
          jobName: job.name,
          reason: 'not_implemented',
        });
        this.appLogger.warn('Refusing infrastructure job — Not Implemented', {
          jobName: job.name,
          queueName: job.queueName,
          jobId: job.id,
        });
        throw new Error(
          `Job "${job.name}" on queue "${job.queueName}" is Not Implemented (M8 infrastructure only)`,
        );
      });
    };
  }
}
