import type { HealthStatus } from '@project-genesis/types';
import { AuthApi } from './auth/auth-api';
import { HttpClient, type HttpClientOptions } from './http/http-client';

export interface ApiClientOptions extends HttpClientOptions {
  readonly baseUrl: string;
}

/**
 * Browser/server HTTP client for the NestJS API.
 */
export class ApiClient {
  private readonly http: HttpClient;
  public readonly auth: AuthApi;
  private readonly baseUrl: string;
  private accessToken: string | null = null;

  public constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl;
    this.http = new HttpClient({
      ...options,
      getAccessToken: () => this.accessToken,
      setAccessToken: (token: string | null) => {
        this.accessToken = token;
      },
      refreshAccessToken: async () => {
        const refreshed = await this.auth.refresh();
        this.setAccessToken(refreshed.accessToken);
        return refreshed.accessToken;
      },
    });
    this.auth = new AuthApi(this.http);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  public async getHealthPlaceholder(): Promise<HealthStatus> {
    return { status: 'ok' };
  }
}

export { ApiClientError, isApiClientError } from './http/errors';
export type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './auth/auth-api';
