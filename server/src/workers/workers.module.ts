import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import type { EnvConfig } from '../config/env.validation';
import { createBullMqRedisConnection } from '../queues/bullmq-redis';
import { BULLMQ_WORKER_CONNECTION, WORKER_REGISTRY } from '../queues/queues.constants';
import { InfrastructureProcessor } from './infrastructure.processor';
import { WorkerRegistry } from './worker.registry';

/**
 * BullMQ consumer-side module (worker process only).
 * Do not import this into the HTTP API AppModule.
 */
@Module({
  providers: [
    {
      provide: BULLMQ_WORKER_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>): Redis => {
        const url = config.get('REDIS_URL', { infer: true });
        return createBullMqRedisConnection(url, 'worker');
      },
    },
    InfrastructureProcessor,
    {
      provide: WORKER_REGISTRY,
      useClass: WorkerRegistry,
    },
  ],
  exports: [BULLMQ_WORKER_CONNECTION, WORKER_REGISTRY],
})
export class WorkersModule {}
