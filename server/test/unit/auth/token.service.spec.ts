import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import {
  InvalidAccessTokenError,
  TokenVersionMismatchError,
} from '../../../src/auth/auth.errors';
import { TokenService } from '../../../src/auth/token.service';
import { UserRole } from '../../../src/users/user.enums';
import { testEnvFixture } from '../../../../tests/fixtures/env.fixture';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useFactory: () =>
            new JwtService({
              secret: testEnvFixture.JWT_SECRET,
            }),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'JWT_ACCESS_EXPIRES_IN') {
                return '15m';
              }
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(TokenService);
  });

  it('should_sign_access_token_with_minimal_claims', async () => {
    const token = await service.signAccessToken({
      sub: '507f1f77bcf86cd799439011',
      role: UserRole.User,
      tokenVersion: 0,
    });

    const verified = await service.verifyAccessToken(token);
    expect(verified.sub).toBe('507f1f77bcf86cd799439011');
    expect(verified.role).toBe(UserRole.User);
    expect(verified.tokenVersion).toBe(0);
    expect(verified.iat).toBeDefined();
    expect(verified.exp).toBeDefined();
    expect(verified.jti).toBeDefined();
    expect(verified).not.toHaveProperty('email');
    expect(verified).not.toHaveProperty('workspaceId');
  });

  it('should_reject_tampered_token', async () => {
    const token = await service.signAccessToken({
      sub: '507f1f77bcf86cd799439011',
      role: UserRole.User,
      tokenVersion: 1,
    });
    await expect(service.verifyAccessToken(`${token}x`)).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('should_reject_token_version_mismatch', async () => {
    const token = await service.signAccessToken({
      sub: '507f1f77bcf86cd799439011',
      role: UserRole.Admin,
      tokenVersion: 2,
    });
    await expect(service.verifyAccessToken(token, 3)).rejects.toBeInstanceOf(
      TokenVersionMismatchError,
    );
    await expect(service.verifyAccessToken(token, 2)).resolves.toMatchObject({
      tokenVersion: 2,
    });
  });
});
