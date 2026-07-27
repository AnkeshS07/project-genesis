import { isApiClientError } from '@project-genesis/sdk';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  EMAIL_TAKEN: 'An account with this email already exists.',
  ACCOUNT_DISABLED: 'This account has been disabled.',
  ACCOUNT_LOCKED: 'This account is locked. Try again later.',
  TOKEN_EXPIRED: 'Your session expired. Sign in again.',
  TOKEN_VERSION_MISMATCH: 'Your session is no longer valid. Sign in again.',
  INVALID_ACCESS_TOKEN: 'Your session is no longer valid. Sign in again.',
  REFRESH_INVALID: 'Your session expired. Sign in again.',
  REFRESH_REUSED: 'Your session was revoked for security. Sign in again.',
  RESET_TOKEN_INVALID: 'This reset link is invalid or has expired.',
  VALIDATION_ERROR: 'Check the highlighted fields and try again.',
};

export function mapAuthError(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (isApiClientError(error)) {
    return AUTH_ERROR_MESSAGES[error.code] ?? error.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
