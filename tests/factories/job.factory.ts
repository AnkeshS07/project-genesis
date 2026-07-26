import { createTestId } from './id.factory';

export type InfraJobFactoryInput = {
  readonly id?: string;
  readonly name?: string;
  readonly queueName?: string;
  readonly correlationId?: string;
  readonly data?: Record<string, unknown>;
};

/**
 * Builds a BullMQ-shaped job stub for unit tests (no Redis / BullMQ connection).
 */
export function createInfrastructureJobStub(input: InfraJobFactoryInput = {}) {
  const id = input.id ?? createTestId('job-1');
  return {
    id,
    name: input.name ?? 'system.ping',
    queueName: input.queueName ?? 'default',
    data: {
      ...(input.correlationId ? { correlationId: input.correlationId } : {}),
      ...(input.data ?? {}),
    },
  };
}
