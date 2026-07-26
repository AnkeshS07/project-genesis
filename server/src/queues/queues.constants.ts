/**
 * BullMQ DI tokens and generic queue names (Epic 00 / M7).
 * Names are infrastructure-only — not tied to any product feature.
 */
export const BULLMQ_QUEUE_CONNECTION = Symbol('BULLMQ_QUEUE_CONNECTION');
export const BULLMQ_WORKER_CONNECTION = Symbol('BULLMQ_WORKER_CONNECTION');
export const QUEUE_REGISTRY = Symbol('QUEUE_REGISTRY');
export const WORKER_REGISTRY = Symbol('WORKER_REGISTRY');
export const JOB_REGISTRY = Symbol('JOB_REGISTRY');

/**
 * Future-proof generic queue names.
 * Feature-specific queues (AI, export, email, …) are added in later epics.
 */
export const QUEUE_NAMES = {
  DEFAULT: 'default',
  SYSTEM: 'system',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const INFRASTRUCTURE_QUEUES: readonly QueueName[] = [
  QUEUE_NAMES.DEFAULT,
  QUEUE_NAMES.SYSTEM,
];
