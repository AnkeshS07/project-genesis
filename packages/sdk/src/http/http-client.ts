import type { ApiEnvelope } from '@project-genesis/types';
import { ApiClientError, parseEnvelope } from './errors';

export interface HttpClientOptions {
  readonly baseUrl: string;
  readonly getAccessToken?: () => string | null;
  readonly setAccessToken?: (token: string | null) => void;
  readonly refreshAccessToken?: () => Promise<string | null>;
}

export interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  readonly body?: unknown;
  readonly auth?: boolean;
  readonly credentials?: RequestCredentials;
  readonly retryOnUnauthorized?: boolean;
}

export class HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  async request<T>(path: string, requestOptions: RequestOptions = {}): Promise<T> {
    const execute = async (allowRefresh: boolean): Promise<T> => {
      const init: RequestInit = {
        method: requestOptions.method ?? 'GET',
        headers: this.buildHeaders(requestOptions.auth ?? false, requestOptions.body),
        credentials: requestOptions.credentials ?? 'include',
      };

      if (requestOptions.body !== undefined) {
        init.body = JSON.stringify(requestOptions.body);
      }

      const response = await fetch(this.buildUrl(path), init);

      if (
        allowRefresh &&
        response.status === 401 &&
        requestOptions.auth &&
        requestOptions.retryOnUnauthorized !== false &&
        this.options.refreshAccessToken
      ) {
        const refreshed = await this.options.refreshAccessToken();
        if (refreshed) {
          return execute(false);
        }
      }

      return parseEnvelope<T>(response);
    };

    return execute(true);
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const base = this.options.baseUrl.replace(/\/$/, '');
    return `${base}${normalizedPath}`;
  }

  private buildHeaders(auth: boolean, body?: unknown): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    if (auth) {
      const token = this.options.getAccessToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }
}

export async function safeParseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError('Invalid JSON response', 'INTERNAL_SERVER_ERROR', response.status);
  }
}
