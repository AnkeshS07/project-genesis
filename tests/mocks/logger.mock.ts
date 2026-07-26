import type { AppLogger } from '../../server/src/telemetry/logging/app-logger.service';

export function createAppLoggerMock(): jest.Mocked<
  Pick<AppLogger, 'debug' | 'info' | 'warn' | 'error'>
> {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
