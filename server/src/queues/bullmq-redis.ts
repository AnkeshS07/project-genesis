import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Create an ioredis client configured for BullMQ.
 * BullMQ requires maxRetriesPerRequest: null (blocking commands).
 * Do not reuse the API RedisService client for queues/workers.
 */
export function createBullMqRedisConnection(redisUrl: string, label: string): Redis {
  const logger = new Logger(`BullMqRedis:${label}`);

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 10_000,
  });

  client.on('error', (error: Error) => {
    logger.error(`Redis connection error: ${error.message}`);
  });

  client.on('connect', () => {
    logger.log('Redis connection established');
  });

  return client;
}

export async function closeBullMqRedisConnection(client: Redis, label: string): Promise<void> {
  const logger = new Logger(`BullMqRedis:${label}`);
  try {
    if (client.status !== 'end') {
      await client.quit();
      logger.log('Redis connection closed');
    }
  } catch (error) {
    logger.warn(
      `Redis quit failed; forcing disconnect: ${error instanceof Error ? error.message : String(error)}`,
    );
    client.disconnect();
  }
}
