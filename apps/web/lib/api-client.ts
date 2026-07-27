import { ApiClient } from '@project-genesis/sdk';

let browserClient: ApiClient | null = null;

/**
 * Browser requests use same-origin relative URLs so refresh cookies work via Next rewrites.
 * Server-side calls use the configured NestJS base URL.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }

  return process.env.NEXT_PUBLIC_API_URL ?? process.env.API_PROXY_TARGET ?? 'http://localhost:3001';
}

export function createApiClient(): ApiClient {
  if (typeof window !== 'undefined') {
    browserClient ??= new ApiClient({ baseUrl: getApiBaseUrl() });
    return browserClient;
  }

  return new ApiClient({ baseUrl: getApiBaseUrl() });
}
