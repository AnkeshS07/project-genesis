import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from './common/interceptors/response-envelope.interceptor';
import type { EnvConfig } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.enableShutdownHooks();

  // Domain REST APIs will use /api/v1 later. Health probes stay unversioned at root.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project Genesis API')
    .setDescription(
      'Infrastructure bootstrap — MongoDB + Redis connected; no business endpoints yet (Epic 00 / M5).',
    )
    .setVersion('0.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const config = app.get(ConfigService<EnvConfig, true>);
  const port = config.get('PORT', { infer: true });

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`NestJS API listening on http://localhost:${port}`);
  logger.log(`Health: /health /ready /live`);
  logger.log(`Swagger: http://localhost:${port}/docs`);
}

void bootstrap();
