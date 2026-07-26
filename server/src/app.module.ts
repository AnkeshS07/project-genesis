import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { JobsModule } from './jobs/jobs.module';
import { ProvidersModule } from './providers/providers.module';
import { QueuesModule } from './queues/queues.module';
import { HealthModule } from './modules/health/health.module';
import { CorrelationMiddleware } from './telemetry/correlation/correlation.middleware';
import { REQUEST_ID_HEADER, TELEMETRY_SERVICE_KIND } from './telemetry/telemetry.constants';
import { TelemetryModule } from './telemetry/telemetry.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    AppConfigModule,
    TelemetryModule,
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req, res) => {
          const existing = req.headers[REQUEST_ID_HEADER];
          const id = typeof existing === 'string' && existing.length > 0 ? existing : randomUUID();
          res.setHeader(REQUEST_ID_HEADER, id);
          return id;
        },
        ...(isProduction
          ? {}
          : {
              transport: {
                target: 'pino-pretty',
                options: { singleLine: true },
              },
            }),
        autoLogging: true,
        quietReqLogger: true,
      },
    }),
    DatabaseModule,
    ProvidersModule,
    QueuesModule,
    JobsModule,
    HealthModule,
  ],
  providers: [
    GlobalExceptionFilter,
    ResponseEnvelopeInterceptor,
    { provide: TELEMETRY_SERVICE_KIND, useValue: 'api' },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
