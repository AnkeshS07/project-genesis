import type { UserRole, UserStatus } from '../../users/user.enums';

/** Authenticated principal attached by JwtAuthGuard — safe for handlers. */
export interface AuthPrincipal {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly tokenVersion: number;
}

export interface SafeAuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
}

export interface AuthTokensPayload {
  readonly accessToken: string;
}

export interface RegisterLoginPayload extends AuthTokensPayload {
  readonly user: SafeAuthUser;
}

export interface AuthSessionMetadata {
  readonly ip?: string | null;
  readonly userAgent?: string | null;
  readonly deviceLabel?: string | null;
}

export interface AuthSessionResult extends RegisterLoginPayload {
  readonly rawRefreshToken: string;
}

export interface RefreshSessionResult extends AuthTokensPayload {
  readonly rawRefreshToken: string;
}
