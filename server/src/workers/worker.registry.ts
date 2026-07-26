import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import type { ConnectionOptions, Worker } from 'bullmq';
import { Worker as BullWorker } from 'bullmq';
import type Redis from 'ioredis';
import { closeBullMqRedisConnection } from '../queues/bullmq-redis';
import {
  BULLMQ_WORKER_CONNECTION,
  INFRASTRUCTURE_QUEUES,
  type QueueName,
} from '../queues/queues.constants';
import { AppLogger } from '../telemetry/logging/app-logger.service';
import { InfrastructureProcessor } from './infrastructure.processor';
import { runWithWorkerJobContext } from './worker-log.context';

export type RegisteredWorkerInfo = {
  readonly queueName: QueueName;
  readonly running: boolean;
};

/**
 * Owns BullMQ Worker consumers for the worker process.
 * Workers idle until jobs appear; any job is refused (Not Implemented).
 */
@Injectable()
export class WorkerRegistry implements OnModuleInit, OnModuleDestroy {
  private readonly workers = new Map<QueueName, Worker>();

  constructor(
    @Inject(BULLMQ_WORKER_CONNECTION) private readonly connection: Redis,
    private readonly infrastructureProcessor: InfrastructureProcessor,
    private readonly appLogger: AppLogger,
  ) {}

  onModuleInit(): void {
    const processor = this.infrastructureProcessor.create();

    for (const name of INFRASTRUCTURE_QUEUES) {
      const worker = new BullWorker(name, processor, {
        connection: this.connection as ConnectionOptions,
        concurrency: 1,
        autorun: true,
      });

      worker.on('ready', () => {
        this.appLogger.info('Worker ready', { queueName: name });
      });

      worker.on('error', (error: Error) => {
        this.appLogger.error('Worker error', { queueName: name }, error);
      });

      worker.on('active', (job) => {
        runWithWorkerJobContext(job, () => {
          this.appLogger.debug('Job active', {
            jobName: job.name,
            queueName: name,
            jobId: job.id,
          });
        });
      });

      worker.on('failed', (job, error) => {
        if (job) {
          runWithWorkerJobContext(job, () => {
            this.appLogger.warn('Job failed / refused', {
              jobName: job.name,
              queueName: name,
              jobId: job.id,
              error: error.message,
            });
          });
          return;
        }
        this.appLogger.warn('Job failed without job payload', {
          queueName: name,
          error: error.message,
        });
      });

      this.workers.set(name, worker);
      this.appLogger.info('Worker registered', { queueName: name });
    }
  }

  list(): readonly RegisteredWorkerInfo[] {
    return [...this.workers.entries()].map(([queueName, worker]) => ({
      queueName,
      running: worker.isRunning(),
    }));
  }

  async onModuleDestroy(): Promise<void> {
    for (const [name, worker] of this.workers) {
      await worker.close();
      this.appLogger.info('Worker closed', { queueName: name });
    }
    this.workers.clear();
    await closeBullMqRedisConnection(this.connection, 'worker');
  }
}
