import type { INestApplication, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import request from 'supertest';
import { RedisService } from '../../src/database/redis.service';
import { HealthController } from '../../src/modules/health/health.controller';
import { HealthService } from '../../src/modules/health/health.service';
import { CorrelationMiddleware } from '../../src/telemetry/correlation/correlation.middleware';
import { TELEMETRY_SERVICE_KIND } from '../../src/telemetry/telemetry.constants';
import { TelemetryModule } from '../../src/telemetry/telemetry.module';
import { httpHeaderFixture } from '../../../tests/fixtures/http.fixture';
import { createRedisMock } from '../../../tests/mocks/redis.mock';

/**
 * In-process API smoke module — real HealthService.getLive (no Mongo/Redis I/O).
 * Connection/Redis tokens are mocked so the module can construct.
 */
@Module({
  imports: [TelemetryModule],
  controllers: [HealthController],
  providers: [
    HealthService,
    { provide: TELEMETRY_SERVICE_KIND, useValue: 'api' },
    { provide: getConnectionToken(), useValue: { readyState: 0, db: undefined } },
    {
      provide: RedisService,
      useValue: createRedisMock(),
    },
  ],
})
class ApiSmokeModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}

describe('Health API smoke', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(ApiSmokeModule, { logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should_return_live_probe_envelope', async () => {
    const res = await request(app.getHttpServer()).get('/live').expect(200);

    expect(res.body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
        service: 'api',
      },
    });
    expect(typeof res.body.data.timestamp).toBe('string');
  });

  it('should_echo_request_and_correlation_headers', async () => {
    const res = await request(app.getHttpServer())
      .get('/live')
      .set('x-request-id', httpHeaderFixture.requestId)
      .set('x-correlation-id', httpHeaderFixture.correlationId)
      .expect(200);

    expect(res.headers['x-request-id']).toBe(httpHeaderFixture.requestId);
    expect(res.headers['x-correlation-id']).toBe(httpHeaderFixture.correlationId);
  });
});
