import { mapAuthError } from '@/features/auth/map-auth-error';
import { ApiClientError } from '@project-genesis/sdk';

describe('mapAuthError', () => {
  it('maps known auth error codes', () => {
    const error = new ApiClientError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    expect(mapAuthError(error)).toBe('Email or password is incorrect.');
  });

  it('falls back for unknown errors', () => {
    expect(mapAuthError(new Error('boom'), 'Fallback')).toBe('boom');
    expect(mapAuthError(null, 'Fallback')).toBe('Fallback');
  });
});
