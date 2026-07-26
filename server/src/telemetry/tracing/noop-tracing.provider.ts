import { Injectable } from '@nestjs/common';
import type { SpanAttributes, SpanPort, TracerPort } from './tracing.interface';

class NoopSpan implements SpanPort {
  setAttribute(key: string, value: string | number | boolean): void {
    void key;
    void value;
  }

  recordException(error: unknown): void {
    void error;
  }

  end(): void {
    // no-op
  }
}

/**
 * No-op tracer for M8 — no OpenTelemetry SDK.
 */
@Injectable()
export class NoopTracerProvider implements TracerPort {
  startSpan(name: string, attributes?: SpanAttributes): SpanPort {
    void name;
    void attributes;
    return new NoopSpan();
  }

  withSpan<T>(name: string, fn: (span: SpanPort) => T, attributes?: SpanAttributes): T {
    const span = this.startSpan(name, attributes);
    try {
      return fn(span);
    } catch (error) {
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  }
}
