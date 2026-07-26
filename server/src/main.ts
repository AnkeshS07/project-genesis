import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
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

  // ValidationPipe is Nest's standard bootstrap construction (no injectable deps).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(app.get(GlobalExceptionFilter));
  app.useGlobalInterceptors(app.get(TimingInterceptor), app.get(ResponseEnvelopeInterceptor));
  app.enableShutdownHooks();

  // Domain REST APIs will use /api/v1 later. Health probes stay unversioned at root.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project Genesis API')
    .setDescription(
      'Infrastructure bootstrap — MongoDB + Redis; providers; BullMQ; observability ports (no vendors). Epic 00 / M8.',
    )
    .setVersion('0.0.0')
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
  });
}

void bootstrap();
