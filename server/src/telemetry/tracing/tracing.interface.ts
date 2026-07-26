export type SpanAttributes = Readonly<Record<string, string | number | boolean>>;

export interface SpanPort {
  setAttribute(key: string, value: string | number | boolean): void;
  recordException(error: unknown): void;
  end(): void;
}

/**
 * Vendor-neutral tracing port (OpenTelemetry-shaped, no SDK).
 */
export interface TracerPort {
  startSpan(name: string, attributes?: SpanAttributes): SpanPort;
  withSpan<T>(name: string, fn: (span: SpanPort) => T, attributes?: SpanAttributes): T;
}
