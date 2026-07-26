import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { EnvConfig } from '../config/env.validation';

/**
 * Owns the Redis client lifecycle for the API process (health/ping).
 * BullMQ uses a separate Redis connection (maxRetriesPerRequest: null).
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(config: ConfigService<EnvConfig, true>) {
    const url = config.get('REDIS_URL', { infer: true });

    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      connectTimeout: 10_000,
      // Fail fast during bootstrap; do not keep retrying forever.
      retryStrategy: () => null,
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis client error: ${error.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.client.status !== 'end') {
        await this.client.quit();
        this.logger.log('Redis connection closed');
      }
    } catch (error) {
      this.logger.warn(
        `Redis quit failed; forcing disconnect: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }
}
