import { Module } from '@nestjs/common';
import { MongoModule } from './mongo.module';
import { RedisModule } from './redis.module';

/**
 * Aggregates MongoDB + Redis infrastructure for the NestJS API.
 * Domain persistence (users/sessions) is registered via feature modules (Epic 01 M1).
 */
@Module({
  imports: [MongoModule, RedisModule],
  exports: [MongoModule, RedisModule],
})
export class DatabaseModule {}
