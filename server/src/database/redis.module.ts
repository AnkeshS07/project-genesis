import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Redis connection module (Architecture 1.1).
 * Connection lifecycle only — no cache, sessions, or BullMQ in M5.
 */
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
