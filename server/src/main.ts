import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import { ValidationPipe, RequestMethod, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import type { EnvConfig } from './config/env.validation';
import { TimingInterceptor } from './telemetry/interceptors/timing.interceptor';
import { AppLogger } from './telemetry/logging/app-logger.service';
import { TelemetryLifecycleService } from './telemetry/process/telemetry-lifecycle.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));
  // Ensure process handlers + shutdown logging are constructed.
  app.get(TelemetryLifecycleService);

  app.use(cookieParser());

  // ValidationPipe is Nest's standard bootstrap construction (no injectable deps).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalInterceptors(app.get(TimingInterceptor), app.get(ResponseEnvelopeInterceptor));
  app.enableShutdownHooks();

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'ready', method: RequestMethod.GET },
      { path: 'live', method: RequestMethod.GET },
      'docs',
      'docs-json',
    ],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project Genesis API')
    .setDescription(
      'Project Genesis REST API — authentication, health probes, and infrastructure (Architecture 1.1).',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh_token',
      description: 'HttpOnly refresh token cookie (path=/api/v1/auth)',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const config = app.get(ConfigService<EnvConfig, true>);
  const port = config.get('PORT', { infer: true });
  const logger = app.get(AppLogger);

  await app.listen(port);

  logger.info('NestJS API listening', {
    port,
    health: '/health /ready /live',
    docs: `/docs`,
    api: '/api/v1',
  });
}

void bootstrap();
