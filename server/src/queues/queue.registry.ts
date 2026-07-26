import type { OnModuleDestroy } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConnectionOptions, Queue } from 'bullmq';
import { Queue as BullQueue } from 'bullmq';
import type Redis from 'ioredis';
import { closeBullMqRedisConnection } from './bullmq-redis';
import { BULLMQ_QUEUE_CONNECTION, INFRASTRUCTURE_QUEUES, type QueueName } from './queues.constants';
import type { EnqueueOptions, InfrastructureJobData, RegisteredQueueInfo } from './queue.types';

/**
 * Owns BullMQ Queue producers for the API process.
 * Does not register feature queues or enqueue business jobs in M7.
 */
@Injectable()
export class QueueRegistry implements OnModuleDestroy {
  private readonly logger = new Logger(QueueRegistry.name);
  private readonly queues = new Map<QueueName, Queue<InfrastructureJobData>>();

  constructor(@Inject(BULLMQ_QUEUE_CONNECTION) private readonly connection: Redis) {
    for (const name of INFRASTRUCTURE_QUEUES) {
      const queue = new BullQueue<InfrastructureJobData>(name, {
        connection: this.connection as ConnectionOptions,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      });
      this.queues.set(name, queue);
      this.logger.log(`Queue registered: ${name}`);
    }
  }

  list(): readonly RegisteredQueueInfo[] {
    return [...this.queues.keys()].map((name) => ({ name }));
  }

  get(name: QueueName): Queue<InfrastructureJobData> {
    const queue = this.queues.get(name);
    if (!queue) {
      throw new Error(`Queue "${name}" is not registered`);
    }
    return queue;
  }

  /**
   * Enqueue helper reserved for later epics.
   * M7 does not call this from any business path.
   */
  async enqueue(
    queueName: QueueName,
    jobName: string,
    data: InfrastructureJobData,
    options?: EnqueueOptions,
  ): Promise<string> {
    const job = await this.get(queueName).add(jobName, data, options);
    return job.id ?? '';
  }

  async onModuleDestroy(): Promise<void> {
    for (const [name, queue] of this.queues) {
      await queue.close();
      this.logger.log(`Queue closed: ${name}`);
    }
    this.queues.clear();
    await closeBullMqRedisConnection(this.connection, 'queue');
  }
}
