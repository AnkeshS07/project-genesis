import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AUTH_MAX_ACTIVE_SESSIONS } from '../../../src/auth/auth.constants';
import {
  InvalidRefreshTokenError,
  RefreshTokenReuseError,
} from '../../../src/auth/auth.errors';
import { SessionService } from '../../../src/auth/session.service';
import { SESSION_REPOSITORY } from '../../../src/repositories/repository.tokens';
import type { SessionDocument } from '../../../src/sessions/session.schema';
import type { SessionRepository } from '../../../src/sessions/session.repository.interface';

function sessionDoc(partial: Partial<SessionDocument> & { id: string; userId: string }): SessionDocument {
  return {
    ...partial,
    id: partial.id,
    userId: new Types.ObjectId(partial.userId),
    refreshTokenHash: partial.refreshTokenHash ?? 'hash',
    expiresAt: partial.expiresAt ?? new Date(Date.now() + 60_000),
    revokedAt: partial.revokedAt ?? null,
    replacedBySessionId: partial.replacedBySessionId ?? null,
    createdAt: partial.createdAt ?? new Date(),
    updatedAt: partial.updatedAt ?? new Date(),
  } as SessionDocument;
}

describe('SessionService', () => {
  let service: SessionService;
  let repo: jest.Mocked<SessionRepository>;
  const userId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRefreshTokenHash: jest.fn(),
      findActiveByUserId: jest.fn(),
      markRevoked: jest.fn(),
      setReplacedBy: jest.fn(),
      countActiveByUserId: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: SESSION_REPOSITORY, useValue: repo },
        { provide: AUTH_MAX_ACTIVE_SESSIONS, useValue: 2 },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'JWT_REFRESH_EXPIRES_IN') {
                return '7d';
              }
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(SessionService);
  });

  it('should_create_session_with_hashed_refresh_token_only', async () => {
    repo.findActiveByUserId.mockResolvedValue([]);
    const createdId = new Types.ObjectId().toHexString();
    repo.create.mockImplementation(async (data) =>
      sessionDoc({
        id: createdId,
        userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      }),
    );

    const result = await service.createSession(userId, { ip: '127.0.0.1' });
    expect(result.rawRefreshToken.length).toBeGreaterThanOrEqual(40);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        refreshTokenHash: service.hashRefreshToken(result.rawRefreshToken),
        ip: '127.0.0.1',
      }),
    );
    expect(repo.create.mock.calls[0]?.[0].refreshTokenHash).not.toBe(result.rawRefreshToken);
  });

  it('should_enforce_max_active_sessions_fifo', async () => {
    const older = sessionDoc({
      id: new Types.ObjectId().toHexString(),
      userId,
      createdAt: new Date(Date.now() - 10_000),
    });
    const newer = sessionDoc({
      id: new Types.ObjectId().toHexString(),
      userId,
      createdAt: new Date(Date.now() - 5_000),
    });
    repo.findActiveByUserId.mockResolvedValue([older, newer]);
    repo.markRevoked.mockResolvedValue(older);
    repo.create.mockImplementation(async (data) =>
      sessionDoc({
        id: new Types.ObjectId().toHexString(),
        userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      }),
    );

    await service.createSession(userId);
    expect(repo.markRevoked).toHaveBeenCalledWith(older.id, expect.any(Date));
  });

  it('should_rotate_refresh_token_and_revoke_previous', async () => {
    const oldId = new Types.ObjectId().toHexString();
    const newId = new Types.ObjectId().toHexString();
    const raw = 'raw-refresh-token-value-with-enough-entropy-xx';
    const hash = service.hashRefreshToken(raw);

    repo.findByRefreshTokenHash.mockResolvedValue(
      sessionDoc({
        id: oldId,
        userId,
        refreshTokenHash: hash,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    );
    repo.create.mockImplementation(async (data) =>
      sessionDoc({
        id: newId,
        userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      }),
    );
    repo.markRevoked.mockResolvedValue(
      sessionDoc({ id: oldId, userId, revokedAt: new Date() }),
    );
    repo.setReplacedBy.mockResolvedValue(
      sessionDoc({ id: oldId, userId, replacedBySessionId: new Types.ObjectId(newId) }),
    );

    const rotated = await service.rotateRefreshToken(raw);
    expect(rotated.previousSessionId).toBe(oldId);
    expect(rotated.sessionId).toBe(newId);
    expect(rotated.rawRefreshToken).not.toBe(raw);
    expect(repo.markRevoked).toHaveBeenCalledWith(oldId, expect.any(Date));
    expect(repo.setReplacedBy).toHaveBeenCalledWith(oldId, newId);
  });

  it('should_detect_refresh_reuse_and_revoke_all', async () => {
    const raw = 'reused-refresh-token-value-with-entropy-xxxx';
    const hash = service.hashRefreshToken(raw);
    const sid = new Types.ObjectId().toHexString();
    repo.findByRefreshTokenHash.mockResolvedValue(
      sessionDoc({
        id: sid,
        userId,
        refreshTokenHash: hash,
        revokedAt: new Date(),
      }),
    );
    repo.findActiveByUserId.mockResolvedValue([
      sessionDoc({ id: new Types.ObjectId().toHexString(), userId }),
    ]);
    repo.markRevoked.mockResolvedValue(null);

    await expect(service.rotateRefreshToken(raw)).rejects.toBeInstanceOf(RefreshTokenReuseError);
    expect(repo.findActiveByUserId).toHaveBeenCalledWith(userId);
    expect(repo.markRevoked).toHaveBeenCalled();
  });

  it('should_reject_unknown_refresh_token', async () => {
    repo.findByRefreshTokenHash.mockResolvedValue(null);
    await expect(service.rotateRefreshToken('missing')).rejects.toBeInstanceOf(
      InvalidRefreshTokenError,
    );
  });

  it('should_revoke_all_sessions_for_user', async () => {
    const a = sessionDoc({ id: new Types.ObjectId().toHexString(), userId });
    const b = sessionDoc({ id: new Types.ObjectId().toHexString(), userId });
    repo.findActiveByUserId.mockResolvedValue([a, b]);
    repo.markRevoked.mockResolvedValue(null);

    await expect(service.revokeAllSessionsForUser(userId)).resolves.toBe(2);
    expect(repo.markRevoked).toHaveBeenCalledTimes(2);
  });
});
