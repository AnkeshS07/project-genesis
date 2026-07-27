import type { UserRole } from '../users/user.enums';

export interface AccessTokenClaims {
  readonly sub: string;
  readonly role: UserRole;
  readonly tokenVersion: number;
}

export interface VerifiedAccessToken extends AccessTokenClaims {
  readonly iat: number;
  readonly exp: number;
  readonly jti?: string;
}

export interface SessionDeviceMetadata {
  readonly ip?: string | null;
  readonly userAgent?: string | null;
  readonly deviceLabel?: string | null;
}

export interface CreateSessionResult {
  /** Raw refresh token — return to client once; never persist plaintext. */
  readonly rawRefreshToken: string;
  readonly sessionId: string;
  readonly userId: string;
  readonly expiresAt: Date;
}

export interface RotateSessionResult extends CreateSessionResult {
  readonly previousSessionId: string;
}

export interface Argon2RuntimeOptions {
  readonly memoryCost: number;
  readonly timeCost: number;
  readonly parallelism: number;
}
