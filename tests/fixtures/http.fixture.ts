/**
 * Shared HTTP header fixture for correlation / request-id tests.
 */
export const httpHeaderFixture = {
  requestId: 'test-request-id-001',
  correlationId: 'test-correlation-id-001',
} as const;
