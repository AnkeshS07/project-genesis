import { Injectable } from '@nestjs/common';
import type { MetricsPort } from './metrics.interface';

/**
 * No-op metrics backend for M8.
 * Accepts names/labels so call sites stay stable when a real backend is swapped in later.
 */
@Injectable()
export class NoopMetricsProvider implements MetricsPort {
  increment(name: string, value: number = 1, labels?: Readonly<Record<string, string>>): void {
    void name;
    void value;
    void labels;
  }

  observe(name: string, value: number, labels?: Readonly<Record<string, string>>): void {
    void name;
    void value;
    void labels;
  }

  gauge(name: string, value: number, labels?: Readonly<Record<string, string>>): void {
    void name;
    void value;
    void labels;
  }
}
