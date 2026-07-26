/**
 * Queue double for unit tests — never connects to Redis/BullMQ.
 */
export type QueueMock = {
  add: jest.Mock;
  close: jest.Mock;
  name: string;
};

export function createQueueMock(name = 'default'): QueueMock {
  return {
    name,
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    close: jest.fn().mockResolvedValue(undefined),
  };
}
