export type RedisMock = {
  ping: jest.Mock;
  quit: jest.Mock;
  status: string;
};

export function createRedisMock(): RedisMock {
  return {
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
    status: 'ready',
  };
}
