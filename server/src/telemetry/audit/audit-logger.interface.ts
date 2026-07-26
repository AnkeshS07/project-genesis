/**
 * Audit logging port — placeholder only in M8.
 * No security/product audit pipeline yet.
 */
export interface AuditLoggerPort {
  record(event: string, fields?: Readonly<Record<string, unknown>>): void;
}
