import { AppLogger } from '../../../src/telemetry/logging/app-logger.service';
import {
  registerProcessErrorHandlers,
  unregisterProcessErrorHandlers,
} from '../../../src/telemetry/process/process-error.handlers';
import { createAppLoggerMock } from '../../../../tests/mocks/logger.mock';
import { createMetricsMock } from '../../../../tests/mocks/metrics.mock';

describe('process error handlers', () => {
  afterEach(() => {
    unregisterProcessErrorHandlers();
  });

  it('should_register_once_and_unregister_cleanly', () => {
    const logger = createAppLoggerMock();
    const metrics = createMetricsMock();
    const before = process.listenerCount('uncaughtException');

    registerProcessErrorHandlers(logger as unknown as AppLogger, metrics);
    registerProcessErrorHandlers(logger as unknown as AppLogger, metrics);
    expect(process.listenerCount('uncaughtException')).toBe(before + 1);

    unregisterProcessErrorHandlers();
    expect(process.listenerCount('uncaughtException')).toBe(before);
  });
});
