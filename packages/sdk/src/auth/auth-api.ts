import type {
  AuthTokensResponse,
  MessageResponse,
  RegisterLoginResponse,
  SafeAuthUser,
} from '@project-genesis/types';
import type { HttpClient } from '../http/http-client';

export interface LoginInput {
  readonly email: string;
  readonly password: string;
}

export interface RegisterInput {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}

export interface ForgotPasswordInput {
  readonly email: string;
}

export interface ResetPasswordInput {
  readonly token: string;
  readonly password: string;
}

export class AuthApi {
  constructor(private readonly http: HttpClient) {}

  register(input: RegisterInput): Promise<RegisterLoginResponse> {
    return this.http.request<RegisterLoginResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: input,
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  login(input: LoginInput): Promise<RegisterLoginResponse> {
    return this.http.request<RegisterLoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: input,
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  refresh(): Promise<AuthTokensResponse> {
    return this.http.request<AuthTokensResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  logout(): Promise<MessageResponse> {
    return this.http.request<MessageResponse>('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  logoutAll(): Promise<MessageResponse> {
    return this.http.request<MessageResponse>('/api/v1/auth/logout-all', {
      method: 'POST',
      auth: true,
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  forgotPassword(input: ForgotPasswordInput): Promise<MessageResponse> {
    return this.http.request<MessageResponse>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: input,
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  resetPassword(input: ResetPasswordInput): Promise<MessageResponse> {
    return this.http.request<MessageResponse>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: input,
      credentials: 'include',
      retryOnUnauthorized: false,
    });
  }

  me(): Promise<SafeAuthUser> {
    return this.http.request<SafeAuthUser>('/api/v1/auth/me', {
      method: 'GET',
      auth: true,
      credentials: 'include',
    });
  }
}
