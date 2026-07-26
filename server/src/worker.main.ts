import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { JOB_REGISTRY, QUEUE_NAMES, WORKER_REGISTRY } from './queues/queues.constants';
import type { JobRegistry } from './jobs/job.registry';
import { AppLogger } from './telemetry/logging/app-logger.service';
import { TelemetryLifecycleService } from './telemetry/process/telemetry-lifecycle.service';
import type { WorkerRegistry } from './workers/worker.registry';
import { WorkerAppModule } from './worker.module';

/**
 * Worker process entrypoint — BullMQ consumers (Epic 00 / M8).
 * Does not open an HTTP port.
 */
async function bootstrap(): Promise<void> {
  // Pre-DI bootstrap diagnostic only: AppLogger is unavailable until Nest context exists.
  // If createApplicationContext hangs or throws before DI, this is the only signal.
  // Do not add further console.* after this point.
  console.error('[worker] bootstrap starting (pre-DI)');

  const app = await NestFactory.createApplicationContext(WorkerAppModule, {
    bufferLogs: false,
    abortOnError: true,
  });

  app.enableShutdownHooks();
  // Ensure process handlers + shutdown logging are constructed.
  app.get(TelemetryLifecycleService);

  const workers = app.get<WorkerRegistry>(WORKER_REGISTRY);
  const jobs = app.get<JobRegistry>(JOB_REGISTRY);
  const logger = app.get(AppLogger);

  logger.info('NestJS worker process started', {
    queues: Object.values(QUEUE_NAMES),
    workers: workers.list().map((worker) => ({
      queueName: worker.queueName,
      running: worker.running,
    })),
    jobCatalog: jobs.list().map((job) => ({
      name: job.name,
      implemented: job.implemented,
    })),
  });
  logger.info('No business jobs are registered or executed in M8');
}

void bootstrap();
