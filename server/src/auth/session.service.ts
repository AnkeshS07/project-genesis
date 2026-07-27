import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from '../config/env.validation';
import { SESSION_REPOSITORY } from '../repositories/repository.tokens';
import type { SessionRepository } from '../sessions/session.repository.interface';
import type { SessionDocument } from '../sessions/session.schema';
import {
  AUTH_MAX_ACTIVE_SESSIONS,
  DEFAULT_MAX_ACTIVE_SESSIONS,
  REFRESH_TOKEN_BYTES,
} from './auth.constants';
import { InvalidRefreshTokenError, RefreshTokenReuseError } from './auth.errors';
import type {
  CreateSessionResult,
  RotateSessionResult,
  SessionDeviceMetadata,
} from './auth.types';
import { parseDurationToMs } from './duration.util';

/**
 * Refresh-session lifecycle (opaque tokens). No cookies / HTTP / request objects.
 */
@Injectable()
export class SessionService {
  private readonly refreshTtlMs: number;
  private readonly maxActiveSessions: number;

  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessions: SessionRepository,
    config: ConfigService<EnvConfig, true>,
    @Inject(AUTH_MAX_ACTIVE_SESSIONS) maxActiveSessions: number,
  ) {
    this.refreshTtlMs = parseDurationToMs(config.get('JWT_REFRESH_EXPIRES_IN', { infer: true }));
    this.maxActiveSessions = maxActiveSessions ?? DEFAULT_MAX_ACTIVE_SESSIONS;
  }

  async createSession(
    userId: string,
    metadata: SessionDeviceMetadata = {},
  ): Promise<CreateSessionResult> {
    await this.enforceMaxSessions(userId);
    return this.persistNewSession(userId, metadata);
  }

  async findSessionByRawRefreshToken(rawRefreshToken: string): Promise<SessionDocument | null> {
    const hash = this.hashRefreshToken(rawRefreshToken);
    return this.sessions.findByRefreshTokenHash(hash);
  }

  async markRevoked(sessionId: string, revokedAt: Date = new Date()): Promise<void> {
    await this.sessions.markRevoked(sessionId, revokedAt);
  }

  async revokeAllSessionsForUser(userId: string): Promise<number> {
    const active = await this.sessions.findActiveByUserId(userId);
    const now = new Date();
    await Promise.all(active.map((session) => this.sessions.markRevoked(session.id, now)));
    return active.length;
  }

  async countActiveSessions(userId: string): Promise<number> {
    return this.sessions.countActiveByUserId(userId);
  }

  /**
   * Rotate refresh token: issue new session, revoke old, link replacement.
   * Reuse of an already-revoked token triggers global session revoke for that user.
   */
  async rotateRefreshToken(
    rawRefreshToken: string,
    metadata: SessionDeviceMetadata = {},
  ): Promise<RotateSessionResult> {
    const hash = this.hashRefreshToken(rawRefreshToken);
    const existing = await this.sessions.findByRefreshTokenHash(hash);

    if (!existing) {
      throw new InvalidRefreshTokenError();
    }

    const userId = String(existing.userId);

    if (existing.revokedAt !== null) {
      await this.revokeAllSessionsForUser(userId);
      throw new RefreshTokenReuseError();
    }

    if (existing.expiresAt.getTime() <= Date.now()) {
      await this.sessions.markRevoked(existing.id, new Date());
      throw new InvalidRefreshTokenError('Refresh token expired');
    }

    // Net-zero session count: do not FIFO-evict during rotation.
    const created = await this.persistNewSession(userId, metadata);
    await this.sessions.markRevoked(existing.id, new Date());
    await this.sessions.setReplacedBy(existing.id, created.sessionId);

    return {
      ...created,
      previousSessionId: existing.id,
    };
  }

  hashRefreshToken(rawRefreshToken: string): string {
    return createHash('sha256').update(rawRefreshToken, 'utf8').digest('hex');
  }

  safeEqualHashes(a: string, b: string): boolean {
    const left = Buffer.from(a, 'utf8');
    const right = Buffer.from(b, 'utf8');
    if (left.length !== right.length) {
      return false;
    }
    return timingSafeEqual(left, right);
  }

  private async persistNewSession(
    userId: string,
    metadata: SessionDeviceMetadata,
  ): Promise<CreateSessionResult> {
    const rawRefreshToken = this.generateOpaqueRefreshToken();
    const refreshTokenHash = this.hashRefreshToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);

    const session = await this.sessions.create({
      userId,
      refreshTokenHash,
      expiresAt,
      ip: metadata.ip ?? null,
      userAgent: metadata.userAgent ?? null,
      deviceLabel: metadata.deviceLabel ?? null,
    });

    return {
      rawRefreshToken,
      sessionId: session.id,
      userId: String(session.userId),
      expiresAt: session.expiresAt,
    };
  }

  private generateOpaqueRefreshToken(): string {
    return randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');
  }

  private async enforceMaxSessions(userId: string): Promise<void> {
    const active = await this.sessions.findActiveByUserId(userId);
    if (active.length < this.maxActiveSessions) {
      return;
    }

    const overflow = active.length - this.maxActiveSessions + 1;
    const toRevoke = active.slice(0, overflow);
    const now = new Date();
    await Promise.all(toRevoke.map((session) => this.sessions.markRevoked(session.id, now)));
  }
}
