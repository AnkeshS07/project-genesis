import { randomUUID } from 'node:crypto';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { CORRELATION_ID_HEADER, REQUEST_ID_HEADER } from '../telemetry.constants';
import { runWithCorrelation } from './correlation.context';

/**
 * Ensures request + correlation IDs and binds them into AsyncLocalStorage.
 */
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incomingRequestId = req.header(REQUEST_ID_HEADER);
    const requestId =
      incomingRequestId && incomingRequestId.trim().length > 0
        ? incomingRequestId.trim()
        : randomUUID();

    const incomingCorrelationId = req.header(CORRELATION_ID_HEADER);
    const correlationId =
      incomingCorrelationId && incomingCorrelationId.trim().length > 0
        ? incomingCorrelationId.trim()
        : requestId;

    req.headers[REQUEST_ID_HEADER] = requestId;
    req.headers[CORRELATION_ID_HEADER] = correlationId;
    res.setHeader(REQUEST_ID_HEADER, requestId);
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Isolate this request's store for the Nest/Express async chain started by next().
    runWithCorrelation({ requestId, correlationId, service: 'api' }, () => {
      next();
    });
  }
}
