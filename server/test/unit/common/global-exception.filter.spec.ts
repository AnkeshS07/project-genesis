import { HttpException, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../../src/common/filters/global-exception.filter';
import { runWithCorrelation } from '../../../src/telemetry/correlation/correlation.context';
import { createAppLoggerMock } from '../../../../tests/mocks/logger.mock';

function createHost(requestIdHeader?: string): {
  host: ArgumentsHost;
  status: jest.Mock;
  json: jest.Mock;
} {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const response = { status };
  const request = {
    url: '/boom',
    method: 'GET',
    header: (name: string) => (name.toLowerCase() === 'x-request-id' ? requestIdHeader : undefined),
  };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('GlobalExceptionFilter', () => {
  it('should_return_error_envelope_with_requestId_from_als', () => {
    const appLogger = createAppLoggerMock();
    const filter = new GlobalExceptionFilter(appLogger as never);
    const { host, status, json } = createHost();

    runWithCorrelation({ service: 'api', requestId: 'als-req', correlationId: 'als-corr' }, () => {
      filter.catch(new HttpException('Nope', HttpStatus.BAD_REQUEST), host);
    });

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Nope',
        requestId: 'als-req',
      },
    });
  });

  it('should_log_server_errors_via_app_logger', () => {
    const appLogger = createAppLoggerMock();
    const filter = new GlobalExceptionFilter(appLogger as never);
    const { host } = createHost('hdr-1');

    filter.catch(new Error('explode'), host);

    expect(appLogger.error).toHaveBeenCalled();
  });
});
