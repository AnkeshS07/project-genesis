import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { getCorrelation, type TelemetryServiceKind } from '../correlation/correlation.context';
import { TELEMETRY_SERVICE_KIND } from '../telemetry.constants';

export type LogFields = Readonly<Record<string, unknown>>;

const REDACT_KEYS = new Set([
  'password',
  'authorization',
  'cookie',
  'token',
  'secret',
  'apiKey',
  'api_key',
]);

/**
 * Structured application logger.
 *
 * Every entry is a single object with:
 * - `msg` (always) — human-readable message
 * - `service` — from ALS, else process default (`TELEMETRY_SERVICE_KIND`)
 * - ALS when present: `requestId`, `correlationId`, `jobId`, `queueName`, `jobName`
 * - caller `fields` (overlay; redacted keys → `[REDACTED]`)
 * - `err` on error() when provided
 *
 * Nest `Logger` is a facade only (not a DI-bypass of AppLogger itself).
 */
@Injectable()
export class AppLogger {
  private readonly logger = new Logger('AppLogger');

  constructor(
    @Optional()
    @Inject(TELEMETRY_SERVICE_KIND)
    private readonly defaultService?: TelemetryServiceKind,
  ) {}

  debug(message: string, fields?: LogFields): void {
    this.logger.debug(this.payload(message, fields));
  }

  info(message: string, fields?: LogFields): void {
    this.logger.log(this.payload(message, fields));
  }

  warn(message: string, fields?: LogFields): void {
    this.logger.warn(this.payload(message, fields));
  }

  error(message: string, fields?: LogFields, err?: unknown): void {
    const payload = this.payload(message, fields);
    if (err instanceof Error) {
      this.logger.error({
        ...payload,
        err: { name: err.name, message: err.message, stack: err.stack },
      });
      return;
    }
    if (err !== undefined) {
      this.logger.error({ ...payload, err });
      return;
    }
    this.logger.error(payload);
  }

  private payload(message: string, fields?: LogFields): Record<string, unknown> {
    const ctx = getCorrelation();
    return this.redact({
      msg: message,
      ...(this.defaultService ? { service: this.defaultService } : {}),
      ...(ctx ?? {}),
      ...fields,
    });
  }

  private redact(fields: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      out[key] = REDACT_KEYS.has(key) ? '[REDACTED]' : value;
    }
    return out;
  }
}
