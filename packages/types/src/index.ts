/**
 * Shared type placeholders. Domain types land in later epics.
 * `WorkspaceId` is reserved for Epic 03 (Workspaces) — not used in bootstrap APIs.
 */
export type WorkspaceId = string;

export interface HealthStatus {
  readonly status: 'ok' | 'degraded' | 'down';
}

export interface ApiSuccessEnvelope<T> {
  readonly success: true;
  readonly data: T;
}

export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly requestId?: string;
}

export interface ApiErrorEnvelope {
  readonly success: false;
  readonly error: ApiErrorBody;
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export type UserRole = 'user' | 'admin';

export type UserStatus = 'active' | 'disabled' | 'locked';

export interface SafeAuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
}

export interface AuthTokensResponse {
  readonly accessToken: string;
}

export interface RegisterLoginResponse extends AuthTokensResponse {
  readonly user: SafeAuthUser;
}

export interface MessageResponse {
  readonly message: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'ACCOUNT_DISABLED'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_VERSION_MISMATCH'
  | 'INVALID_ACCESS_TOKEN'
  | 'REFRESH_INVALID'
  | 'REFRESH_REUSED'
  | 'RESET_TOKEN_INVALID'
  | 'USER_NOT_FOUND'
  | 'VALIDATION_ERROR';
