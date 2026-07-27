import type { ApiEnvelope, ApiErrorBody } from '@project-genesis/types';

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string | undefined;

  constructor(message: string, code: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }

  static fromBody(status: number, body: ApiErrorBody): ApiClientError {
    return new ApiClientError(body.message, body.code, status, body.requestId);
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export async function parseEnvelope<T>(response: Response): Promise<T> {
  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError('Invalid JSON response', 'INTERNAL_SERVER_ERROR', response.status);
  }

  if (!payload || typeof payload !== 'object' || !('success' in payload)) {
    throw new ApiClientError('Malformed API response', 'INTERNAL_SERVER_ERROR', response.status);
  }

  if (!payload.success) {
    throw ApiClientError.fromBody(response.status, payload.error);
  }

  return payload.data;
}
