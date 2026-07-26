import { NoopMetricsProvider } from '../../../src/telemetry/metrics/noop-metrics.provider';
import { NoopTracerProvider } from '../../../src/telemetry/tracing/noop-tracing.provider';
import { NoopAuditLogger } from '../../../src/telemetry/audit/noop-audit.logger';

describe('telemetry NoOp ports', () => {
  it('should_accept_metric_calls_without_throwing', () => {
    const metrics = new NoopMetricsProvider();
    expect(() => metrics.increment('http_requests_total', 1, { method: 'GET' })).not.toThrow();
    expect(() => metrics.observe('http_request_duration_ms', 12, { route: '/live' })).not.toThrow();
    expect(() => metrics.gauge('process_up', 1)).not.toThrow();
  });

  it('should_run_withSpan_and_end_noop_span', () => {
    const tracer = new NoopTracerProvider();
    const value = tracer.withSpan('test-span', (span) => {
      span.setAttribute('http.method', 'GET');
      return 42;
    });
    expect(value).toBe(42);
  });

  it('should_accept_audit_record_without_throwing', () => {
    const audit = new NoopAuditLogger();
    expect(() => audit.record('bootstrap.smoke', { ok: true })).not.toThrow();
  });
});
