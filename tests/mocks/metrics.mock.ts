import type { MetricsPort } from '../../server/src/telemetry/metrics/metrics.interface';

export function createMetricsMock(): jest.Mocked<MetricsPort> {
  return {
    increment: jest.fn(),
    observe: jest.fn(),
    gauge: jest.fn(),
  };
}
