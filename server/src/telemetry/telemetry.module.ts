import { Global, Module } from '@nestjs/common';
import { NoopAuditLogger } from './audit/noop-audit.logger';
import { CorrelationMiddleware } from './correlation/correlation.middleware';
import { TimingInterceptor } from './interceptors/timing.interceptor';
import { AppLogger } from './logging/app-logger.service';
import { NoopMetricsProvider } from './metrics/noop-metrics.provider';
import { TelemetryLifecycleService } from './process/telemetry-lifecycle.service';
import { APP_LOGGER, AUDIT_LOGGER, METRICS, TRACER } from './telemetry.constants';
import { NoopTracerProvider } from './tracing/noop-tracing.provider';

/**
 * Global observability infrastructure (Epic 00 / M8).
 * No Prometheus / Grafana / OpenTelemetry SDK.
 */
@Global()
@Module({
  providers: [
    AppLogger,
    {
      provide: APP_LOGGER,
      useExisting: AppLogger,
    },
    NoopMetricsProvider,
    {
      provide: METRICS,
      useExisting: NoopMetricsProvider,
    },
    NoopTracerProvider,
    {
      provide: TRACER,
      useExisting: NoopTracerProvider,
    },
    NoopAuditLogger,
    {
      provide: AUDIT_LOGGER,
      useExisting: NoopAuditLogger,
    },
    CorrelationMiddleware,
    TimingInterceptor,
    TelemetryLifecycleService,
  ],
  exports: [
    AppLogger,
    APP_LOGGER,
    METRICS,
    TRACER,
    AUDIT_LOGGER,
    CorrelationMiddleware,
    TimingInterceptor,
    TelemetryLifecycleService,
  ],
})
export class TelemetryModule {}
