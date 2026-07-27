export class AuthCoreError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'AuthCoreError';
  }
}

export class InvalidAccessTokenError extends AuthCoreError {
  constructor(message = 'Access token is invalid') {
    super(message, 'INVALID_ACCESS_TOKEN');
    this.name = 'InvalidAccessTokenError';
  }
}

export class TokenVersionMismatchError extends AuthCoreError {
  constructor(message = 'Access token version is stale') {
    super(message, 'TOKEN_VERSION_MISMATCH');
    this.name = 'TokenVersionMismatchError';
  }
}

export class InvalidRefreshTokenError extends AuthCoreError {
  constructor(message = 'Refresh token is invalid') {
    super(message, 'INVALID_REFRESH_TOKEN');
    this.name = 'InvalidRefreshTokenError';
  }
}

export class RefreshTokenReuseError extends AuthCoreError {
  constructor(message = 'Refresh token reuse detected') {
    super(message, 'REFRESH_TOKEN_REUSE');
    this.name = 'RefreshTokenReuseError';
  }
}
