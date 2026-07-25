import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { RedisService } from '../../database/redis.service';

export type DependencyStatus = 'up' | 'down';
export type OverallStatus = 'ok' | 'degraded' | 'down';

export interface DependencyCheck {
  status: DependencyStatus;
  latencyMs?: number;
  error?: string;
}

export interface HealthProbeData {
  status: OverallStatus;
  service: 'api';
  timestamp: string;
  checks?: {
    mongodb: DependencyCheck;
    redis: DependencyCheck;
  };
}

export interface HealthProbeResponse {
  success: true;
  data: HealthProbeData;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly redisService: RedisService,
  ) {}

  async getHealth(): Promise<HealthProbeResponse> {
    const checks = await this.probeDependencies();
    return this.build(this.overallFromChecks(checks), checks);
  }

  async getReady(): Promise<HealthProbeResponse> {
    const checks = await this.probeDependencies();
    const overall = this.overallFromChecks(checks);
    return this.build(overall === 'ok' ? 'ok' : 'down', checks);
  }

  getLive(): HealthProbeResponse {
    return this.build('ok');
  }

  private async probeDependencies(): Promise<{
    mongodb: DependencyCheck;
    redis: DependencyCheck;
  }> {
    const [mongodb, redis] = await Promise.all([this.checkMongo(), this.checkRedis()]);
    return { mongodb, redis };
  }

  private async checkMongo(): Promise<DependencyCheck> {
    const started = Date.now();
    try {
      if (this.mongoConnection.readyState !== 1 || !this.mongoConnection.db) {
        return { status: 'down', error: 'MongoDB connection is not ready' };
      }

      await this.mongoConnection.db.admin().command({ ping: 1 });
      return { status: 'up', latencyMs: Date.now() - started };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`MongoDB health check failed: ${message}`);
      return { status: 'down', latencyMs: Date.now() - started, error: message };
    }
  }

  private async checkRedis(): Promise<DependencyCheck> {
    const started = Date.now();
    try {
      const pong = await this.redisService.ping();
      if (pong !== 'PONG') {
        return {
          status: 'down',
          latencyMs: Date.now() - started,
          error: `Unexpected PING response: ${pong}`,
        };
      }
      return { status: 'up', latencyMs: Date.now() - started };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Redis health check failed: ${message}`);
      return { status: 'down', latencyMs: Date.now() - started, error: message };
    }
  }

  private overallFromChecks(checks: {
    mongodb: DependencyCheck;
    redis: DependencyCheck;
  }): OverallStatus {
    const upCount = [checks.mongodb, checks.redis].filter((check) => check.status === 'up').length;
    if (upCount === 2) {
      return 'ok';
    }
    if (upCount === 0) {
      return 'down';
    }
    return 'degraded';
  }

  private build(
    status: OverallStatus,
    checks?: { mongodb: DependencyCheck; redis: DependencyCheck },
  ): HealthProbeResponse {
    return {
      success: true,
      data: {
        status,
        service: 'api',
        timestamp: new Date().toISOString(),
        ...(checks ? { checks } : {}),
      },
    };
  }
}
