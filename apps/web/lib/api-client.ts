import { ApiClient } from '@project-genesis/sdk';

/**
 * Browser/server-safe NestJS API base URL.
 * Business calls are not implemented in M4 — this only wires the SDK stub.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
}

export function createApiClient(): ApiClient {
  return new ApiClient({ baseUrl: getApiBaseUrl() });
}
