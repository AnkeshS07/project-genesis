import { Injectable } from '@nestjs/common';
import type { AuditLoggerPort } from './audit-logger.interface';

/**
 * No-op audit logger (Epic checklist placeholder).
 */
@Injectable()
export class NoopAuditLogger implements AuditLoggerPort {
  record(event: string, fields?: Readonly<Record<string, unknown>>): void {
    void event;
    void fields;
  }
}
