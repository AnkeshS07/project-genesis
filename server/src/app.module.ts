import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppConfigModule } from './config/app-config.module';
import { RequestIdMiddleware, REQUEST_ID_HEADER } from './common/middleware/request-id.middleware';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    AppConfigModule,
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
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
