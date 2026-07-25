import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { REQUEST_ID_HEADER } from '../middleware/request-id.middleware';

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.header(REQUEST_ID_HEADER) ?? undefined;

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      code = HttpStatus[status] ?? code;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as Record<string, unknown>;
      if (typeof body.message === 'string') {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(', ');
        code = 'VALIDATION_ERROR';
      }
      if (typeof body.error === 'string') {
        code = body.error.toUpperCase().replace(/\s+/g, '_');
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status >= 500) {
      this.logger.error(
        {
          requestId,
          path: request.url,
          method: request.method,
          err: exception instanceof Error ? exception.stack : exception,
        },
        message,
      );
    }

    const payload: ErrorBody = {
      success: false,
      error: {
        code,
        message,
        ...(requestId ? { requestId } : {}),
      },
    };

    response.status(status).json(payload);
  }
}
