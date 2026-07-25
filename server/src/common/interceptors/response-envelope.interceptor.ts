import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Ensures successful JSON responses follow the API envelope when handlers
 * return raw payloads. Health endpoints return their own shape and are left as-is
 * when they already include `success` or are non-object responses.
 */
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data !== null && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return {
          success: true,
          data: data ?? {},
        };
      }),
    );
  }
}
