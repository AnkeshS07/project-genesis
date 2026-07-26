/**
 * Vendor-neutral metrics port.
 * Labels are first-class; keep cardinality low (method, status, queueName, …).
 */
export interface MetricsPort {
  increment(name: string, value?: number, labels?: Readonly<Record<string, string>>): void;
  observe(name: string, value: number, labels?: Readonly<Record<string, string>>): void;
  gauge(name: string, value: number, labels?: Readonly<Record<string, string>>): void;
}
