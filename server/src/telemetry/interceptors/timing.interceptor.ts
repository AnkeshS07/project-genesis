import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from '../logging/app-logger.service';
import type { MetricsPort } from '../metrics/metrics.interface';
import { INFRA_METRIC_NAMES, METRICS } from '../telemetry.constants';

/**
 * Records infrastructure HTTP timing metrics and a debug duration log.
 */
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  constructor(
    private readonly appLogger: AppLogger,
    @Inject(METRICS) private readonly metrics: MetricsPort,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<{ method?: string; route?: { path?: string }; url?: string }>();
    const response = http.getResponse<{ statusCode?: number }>();
    const started = Date.now();
    const method = request.method ?? 'UNKNOWN';
    const route = request.route?.path ?? request.url ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          this.record(method, route, response.statusCode ?? 200, started);
        },
        error: () => {
          this.record(method, route, response.statusCode ?? 500, started);
        },
      }),
    );
  }

  private record(method: string, route: string, status: number, started: number): void {
    const durationMs = Date.now() - started;
    const labels = {
      method,
      route,
      status: String(status),
    };

    this.metrics.increment(INFRA_METRIC_NAMES.HTTP_REQUESTS_TOTAL, 1, labels);
    this.metrics.observe(INFRA_METRIC_NAMES.HTTP_REQUEST_DURATION_MS, durationMs, labels);
    this.appLogger.debug('HTTP request completed', {
      method,
      route,
      status,
      durationMs,
    });
  }
}
