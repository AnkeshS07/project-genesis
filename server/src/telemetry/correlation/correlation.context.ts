import { AsyncLocalStorage } from 'node:async_hooks';

export type TelemetryServiceKind = 'api' | 'worker';

export type CorrelationStore = {
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly service: TelemetryServiceKind;
  readonly jobId?: string;
  readonly queueName?: string;
  readonly jobName?: string;
};

/**
 * Request/job correlation via AsyncLocalStorage.
 *
 * Lifecycle contract:
 * - Each `runWithCorrelation` call creates an isolated store for that async chain.
 * - HTTP: CorrelationMiddleware runs `next` inside `storage.run` (request-scoped).
 * - Worker: job processor/events wrap handlers in `runWithCorrelation` (job-scoped).
 * - Context does not leak across concurrent requests/jobs (separate `run` frames).
 * - Cleanup is automatic when the async chain settles — no manual clear required.
 * - Do not use `enterWith` here (can leak onto unrelated work on the same resource).
 */
const storage = new AsyncLocalStorage<CorrelationStore>();

export function runWithCorrelation<T>(store: CorrelationStore, fn: () => T): T {
  return storage.run(store, fn);
}

export function getCorrelation(): CorrelationStore | undefined {
  return storage.getStore();
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

export function getCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}
