import type { OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { AppLogger } from '../logging/app-logger.service';
import type { MetricsPort } from '../metrics/metrics.interface';
import { METRICS } from '../telemetry.constants';
import {
  registerProcessErrorHandlers,
  unregisterProcessErrorHandlers,
} from './process-error.handlers';

/**
 * Registers process error handlers and tears them down on graceful shutdown.
 * No timers or external telemetry exporters are owned here (NoOp sinks).
 */
@Injectable()
export class TelemetryLifecycleService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly appLogger: AppLogger,
    @Inject(METRICS) private readonly metrics: MetricsPort,
  ) {}

  onModuleInit(): void {
    registerProcessErrorHandlers(this.appLogger, this.metrics);
    this.appLogger.info('Telemetry lifecycle initialized');
  }

  onApplicationShutdown(signal?: string): void {
    this.appLogger.info('Graceful shutdown started', { signal: signal ?? 'unknown' });
    unregisterProcessErrorHandlers();
    this.appLogger.info('Telemetry process handlers detached');
  }
}
