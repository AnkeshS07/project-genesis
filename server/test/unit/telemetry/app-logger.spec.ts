import { Logger } from '@nestjs/common';
import { AppLogger } from '../../../src/telemetry/logging/app-logger.service';
import {
  getCorrelation,
  runWithCorrelation,
} from '../../../src/telemetry/correlation/correlation.context';

describe('AppLogger', () => {
  let logger: AppLogger;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new AppLogger('api');
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should_include_msg_and_service_in_structured_payload', () => {
    logger.info('hello', { route: '/live' });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = logSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload).toMatchObject({
      msg: 'hello',
      service: 'api',
      route: '/live',
    });
  });

  it('should_merge_als_correlation_fields', () => {
    runWithCorrelation({ service: 'api', requestId: 'req-1', correlationId: 'corr-1' }, () => {
      logger.info('with-context');
    });

    const payload = logSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload).toMatchObject({
      msg: 'with-context',
      requestId: 'req-1',
      correlationId: 'corr-1',
    });
    expect(getCorrelation()).toBeUndefined();
  });

  it('should_redact_sensitive_field_keys', () => {
    logger.info('secret-log', { password: 'plain', token: 'abc' });

    const payload = logSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(payload.password).toBe('[REDACTED]');
    expect(payload.token).toBe('[REDACTED]');
  });
});
