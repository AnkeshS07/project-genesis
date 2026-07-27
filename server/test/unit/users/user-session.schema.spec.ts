import { UserRole, UserStatus } from '../../../src/users/user.enums';
import { UserSchema } from '../../../src/users/user.schema';
import { SessionSchema } from '../../../src/sessions/session.schema';
import { validateEnv } from '../../../src/config/env.validation';
import { testEnvFixture } from '../../../../tests/fixtures/env.fixture';

describe('Epic 01 M1 schemas', () => {
  it('should_define_user_indexes_for_role_and_status', () => {
    const indexes = UserSchema.indexes();
    const paths = indexes.map(([fields]) => Object.keys(fields).sort().join(','));
    expect(paths).toEqual(expect.arrayContaining(['role', 'status']));
  });

  it('should_require_user_auth_paths', () => {
    const paths = UserSchema.paths;
    expect(paths.email).toBeDefined();
    expect(Boolean(paths.email.options['unique'])).toBe(true);
    expect(paths.passwordHash).toBeDefined();
    expect(paths.name).toBeDefined();
    expect(paths.role).toBeDefined();
    expect(paths.status).toBeDefined();
    expect(paths.tokenVersion).toBeDefined();
    expect(Object.values(UserRole)).toContain(UserRole.User);
    expect(Object.values(UserStatus)).toContain(UserStatus.Active);
  });

  it('should_not_define_workspace_fields_on_user', () => {
    expect(UserSchema.paths.workspaceId).toBeUndefined();
    expect(UserSchema.paths.workspace).toBeUndefined();
  });

  it('should_define_session_indexes_including_ttl_and_unique_hash', () => {
    const indexes = SessionSchema.indexes();
    const asJson = indexes.map(([fields, options]) => ({
      fields,
      options: options ?? {},
    }));

    expect(asJson).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fields: { refreshTokenHash: 1 },
          options: expect.objectContaining({ unique: true }),
        }),
        expect.objectContaining({
          fields: { userId: 1, revokedAt: 1, expiresAt: 1 },
        }),
        expect.objectContaining({
          fields: { expiresAt: 1 },
          options: expect.objectContaining({ expireAfterSeconds: 0 }),
        }),
      ]),
    );
  });

  it('should_require_session_core_paths', () => {
    const paths = SessionSchema.paths;
    expect(paths.userId).toBeDefined();
    expect(paths.refreshTokenHash).toBeDefined();
    expect(paths.expiresAt).toBeDefined();
    expect(paths.revokedAt).toBeDefined();
    expect(paths.replacedBySessionId).toBeDefined();
  });
});

describe('validateEnv JWT (M1)', () => {
  it('should_accept_jwt_fields_from_fixture', () => {
    const env = validateEnv({ ...testEnvFixture });
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(env.JWT_ACCESS_EXPIRES_IN).toBe('15m');
    expect(env.JWT_REFRESH_EXPIRES_IN).toBe('7d');
  });

  it('should_reject_short_jwt_secret', () => {
    expect(() =>
      validateEnv({
        ...testEnvFixture,
        JWT_SECRET: 'too-short',
      }),
    ).toThrow(/JWT_SECRET/);
  });

  it('should_reject_invalid_jwt_duration', () => {
    expect(() =>
      validateEnv({
        ...testEnvFixture,
        JWT_ACCESS_EXPIRES_IN: 'fifteen-minutes',
      }),
    ).toThrow(/JWT_ACCESS_EXPIRES_IN/);
  });
});
