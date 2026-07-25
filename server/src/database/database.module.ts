import { Module } from '@nestjs/common';
import { MongoModule } from './mongo.module';
import { RedisModule } from './redis.module';

/**
 * Aggregates MongoDB + Redis infrastructure for the NestJS API.
 * Domain schemas / repositories are intentionally absent (M5).
 */
@Module({
  imports: [MongoModule, RedisModule],
  exports: [MongoModule, RedisModule],
})
export class DatabaseModule {}
