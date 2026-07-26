import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Redis from 'ioredis';
import type { EnvConfig } from '../config/env.validation';
import { createBullMqRedisConnection } from './bullmq-redis';
import { BULLMQ_QUEUE_CONNECTION, QUEUE_REGISTRY } from './queues.constants';
import { QueueRegistry } from './queue.registry';

/**
 * BullMQ producer-side module (API process).
 * Registers generic infrastructure queues only.
 */
@Global()
@Module({
  providers: [
    {
      provide: BULLMQ_QUEUE_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>): Redis => {
        const url = config.get('REDIS_URL', { infer: true });
        return createBullMqRedisConnection(url, 'queue');
      },
    },
    {
      provide: QUEUE_REGISTRY,
      useClass: QueueRegistry,
    },
  ],
  exports: [BULLMQ_QUEUE_CONNECTION, QUEUE_REGISTRY],
})
export class QueuesModule {}
