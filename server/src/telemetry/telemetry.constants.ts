/**
 * Telemetry DI tokens and infrastructure metric names (Epic 00 / M8).
 * Business / product metric names are forbidden here.
 */
export const APP_LOGGER = Symbol('APP_LOGGER');
export const METRICS = Symbol('METRICS');
export const TRACER = Symbol('TRACER');
export const AUDIT_LOGGER = Symbol('AUDIT_LOGGER');
/** Process-level default for AppLogger when ALS has no store yet (`api` | `worker`). */
export const TELEMETRY_SERVICE_KIND = Symbol('TELEMETRY_SERVICE_KIND');

export const REQUEST_ID_HEADER = 'x-request-id';
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/** Allowed infrastructure metric names only. */
export const INFRA_METRIC_NAMES = {
  HTTP_REQUESTS_TOTAL: 'http_requests_total',
  HTTP_REQUEST_DURATION_MS: 'http_request_duration_ms',
  PROCESS_UNHANDLED_EXCEPTIONS_TOTAL: 'process_unhandled_exceptions_total',
  PROCESS_UNHANDLED_REJECTIONS_TOTAL: 'process_unhandled_rejections_total',
  WORKER_JOBS_FAILED_TOTAL: 'worker_jobs_failed_total',
} as const;

export type InfraMetricName = (typeof INFRA_METRIC_NAMES)[keyof typeof INFRA_METRIC_NAMES];
