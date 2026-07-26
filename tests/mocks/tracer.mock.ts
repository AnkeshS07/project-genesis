import type { SpanPort, TracerPort } from '../../server/src/telemetry/tracing/tracing.interface';

export function createSpanMock(): jest.Mocked<SpanPort> {
  return {
    setAttribute: jest.fn(),
    recordException: jest.fn(),
    end: jest.fn(),
  };
}

export function createTracerMock(): jest.Mocked<TracerPort> {
  const span = createSpanMock();
  return {
    startSpan: jest.fn(() => span),
    withSpan: jest.fn((_name, fn) => fn(span)),
  };
}
