import { HttpException, HttpStatus } from '@nestjs/common';

export function authHttpException(
  code: string,
  message: string,
  status: HttpStatus,
): HttpException {
  return new HttpException({ error: code, message }, status);
}

export const AuthHttpErrors = {
  invalidCredentials: () =>
    authHttpException('INVALID_CREDENTIALS', 'Invalid email or password', HttpStatus.UNAUTHORIZED),
  emailTaken: () =>
    authHttpException('EMAIL_TAKEN', 'Email is already registered', HttpStatus.CONFLICT),
  accountDisabled: () =>
    authHttpException('ACCOUNT_DISABLED', 'Account is disabled', HttpStatus.FORBIDDEN),
  accountLocked: () =>
    authHttpException('ACCOUNT_LOCKED', 'Account is locked', HttpStatus.FORBIDDEN),
  tokenExpired: () =>
    authHttpException('TOKEN_EXPIRED', 'Access token has expired', HttpStatus.UNAUTHORIZED),
  tokenVersionMismatch: () =>
    authHttpException(
      'TOKEN_VERSION_MISMATCH',
      'Access token version is stale',
      HttpStatus.UNAUTHORIZED,
    ),
  invalidAccessToken: () =>
    authHttpException('INVALID_ACCESS_TOKEN', 'Access token is invalid', HttpStatus.UNAUTHORIZED),
  refreshInvalid: (message = 'Refresh token is invalid') =>
    authHttpException('REFRESH_INVALID', message, HttpStatus.UNAUTHORIZED),
  refreshReused: () =>
    authHttpException('REFRESH_REUSED', 'Refresh token reuse detected', HttpStatus.UNAUTHORIZED),
  resetTokenInvalid: () =>
    authHttpException(
      'RESET_TOKEN_INVALID',
      'Password reset token is invalid or expired',
      HttpStatus.BAD_REQUEST,
    ),
  userNotFound: () =>
    authHttpException('USER_NOT_FOUND', 'User not found', HttpStatus.UNAUTHORIZED),
  genericSuccessMessage: 'If the email exists, a reset link has been sent',
} as const;
