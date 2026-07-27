import { createHash } from 'node:crypto';
import { Types } from 'mongoose';
import type { PasswordResetDocument } from '../../server/src/password-resets/password-reset.schema';
import type { PasswordResetRepository } from '../../server/src/password-resets/password-reset.repository.interface';
import type { SessionDocument } from '../../server/src/sessions/session.schema';
import type { SessionRepository } from '../../server/src/sessions/session.repository.interface';
import type { UserDocument } from '../../server/src/users/user.schema';
import type { UserRepository } from '../../server/src/users/user.repository.interface';
import { UserRole, UserStatus } from '../../server/src/users/user.enums';

function userDoc(partial: Partial<UserDocument> & { email: string; passwordHash: string; name: string }): UserDocument {
  const id = partial.id ?? new Types.ObjectId().toHexString();
  return {
    id,
    email: partial.email.toLowerCase(),
    passwordHash: partial.passwordHash,
    name: partial.name,
    role: partial.role ?? UserRole.User,
    status: partial.status ?? UserStatus.Active,
    tokenVersion: partial.tokenVersion ?? 0,
    lockUntil: partial.lockUntil ?? null,
    createdAt: partial.createdAt ?? new Date(),
    updatedAt: partial.updatedAt ?? new Date(),
  } as UserDocument;
}

function sessionDoc(
  partial: Partial<SessionDocument> & { userId: string; refreshTokenHash: string; expiresAt: Date },
): SessionDocument {
  return {
    id: partial.id ?? new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId(partial.userId),
    refreshTokenHash: partial.refreshTokenHash,
    expiresAt: partial.expiresAt,
    revokedAt: partial.revokedAt ?? null,
    replacedBySessionId: partial.replacedBySessionId ?? null,
    ip: partial.ip ?? null,
    userAgent: partial.userAgent ?? null,
    deviceLabel: partial.deviceLabel ?? null,
    createdAt: partial.createdAt ?? new Date(),
    updatedAt: partial.updatedAt ?? new Date(),
  } as SessionDocument;
}

function resetDoc(
  partial: Partial<PasswordResetDocument> & {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  },
): PasswordResetDocument {
  return {
    id: partial.id ?? new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId(partial.userId),
    tokenHash: partial.tokenHash,
    expiresAt: partial.expiresAt,
    usedAt: partial.usedAt ?? null,
    createdAt: partial.createdAt ?? new Date(),
    updatedAt: partial.updatedAt ?? new Date(),
  } as PasswordResetDocument;
}

export function createInMemoryUserRepository(initial: UserDocument[] = []) {
  const users = new Map<string, UserDocument>(initial.map((user) => [user.id, user]));

  const repo: jest.Mocked<UserRepository> & { clear: () => void } = {
    create: jest.fn(async (data) => {
      const created = userDoc({
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role,
        status: data.status,
        tokenVersion: data.tokenVersion,
        lockUntil: data.lockUntil ?? null,
      });
      users.set(created.id, created);
      return created;
    }),
    findById: jest.fn(async (id) => users.get(id) ?? null),
    findByEmail: jest.fn(async (email) => {
      const normalized = email.trim().toLowerCase();
      return [...users.values()].find((user) => user.email === normalized) ?? null;
    }),
    updatePasswordHash: jest.fn(async (id, passwordHash) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, passwordHash };
      users.set(id, updated);
      return updated;
    }),
    bumpTokenVersion: jest.fn(async (id) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, tokenVersion: user.tokenVersion + 1 };
      users.set(id, updated);
      return updated;
    }),
    updateStatus: jest.fn(async (id, status, lockUntil = null) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, status, lockUntil };
      users.set(id, updated);
      return updated;
    }),
    existsByEmail: jest.fn(async (email) => {
      const normalized = email.trim().toLowerCase();
      return [...users.values()].some((user) => user.email === normalized);
    }),
    clear: () => users.clear(),
  };

  return repo;
}

export function createInMemorySessionRepository() {
  const sessions = new Map<string, SessionDocument>();

  const repo: jest.Mocked<SessionRepository> & { clear: () => void } = {
    create: jest.fn(async (data) => {
      const created = sessionDoc({
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        ip: data.ip,
        userAgent: data.userAgent,
        deviceLabel: data.deviceLabel,
      });
      sessions.set(created.id, created);
      return created;
    }),
    findById: jest.fn(async (id) => sessions.get(id) ?? null),
    findByRefreshTokenHash: jest.fn(async (hash) =>
      [...sessions.values()].find((session) => session.refreshTokenHash === hash) ?? null,
    ),
    findActiveByUserId: jest.fn(async (userId, options) => {
      const now = Date.now();
      const active = [...sessions.values()]
        .filter(
          (session) =>
            String(session.userId) === userId &&
            session.revokedAt === null &&
            session.expiresAt.getTime() > now,
        )
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return typeof options?.limit === 'number' ? active.slice(0, options.limit) : active;
    }),
    markRevoked: jest.fn(async (id, revokedAt) => {
      const session = sessions.get(id);
      if (!session) return;
      sessions.set(id, { ...session, revokedAt });
    }),
    setReplacedBy: jest.fn(async (id, replacedBySessionId) => {
      const session = sessions.get(id);
      if (!session) return;
      sessions.set(id, {
        ...session,
        replacedBySessionId: new Types.ObjectId(replacedBySessionId),
      });
    }),
    countActiveByUserId: jest.fn(async (userId) => {
      const now = Date.now();
      return [...sessions.values()].filter(
        (session) =>
          String(session.userId) === userId &&
          session.revokedAt === null &&
          session.expiresAt.getTime() > now,
      ).length;
    }),
    clear: () => sessions.clear(),
  };

  return repo;
}

export function createInMemoryPasswordResetRepository() {
  const resets = new Map<string, PasswordResetDocument>();

  const repo: jest.Mocked<PasswordResetRepository> & { clear: () => void } = {
    create: jest.fn(async (data) => {
      const created = resetDoc({
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      });
      resets.set(created.id, created);
      return created;
    }),
    findActiveByTokenHash: jest.fn(async (tokenHash) => {
      const now = Date.now();
      return (
        [...resets.values()].find(
          (reset) =>
            reset.tokenHash === tokenHash &&
            reset.usedAt === null &&
            reset.expiresAt.getTime() > now,
        ) ?? null
      );
    }),
    markUsed: jest.fn(async (id, usedAt = new Date()) => {
      const reset = resets.get(id);
      if (!reset) return null;
      const updated = { ...reset, usedAt };
      resets.set(id, updated);
      return updated;
    }),
    invalidateAllForUser: jest.fn(async (userId) => {
      const now = new Date();
      let count = 0;
      for (const [id, reset] of resets.entries()) {
        if (String(reset.userId) === userId && reset.usedAt === null) {
          resets.set(id, { ...reset, usedAt: now });
          count += 1;
        }
      }
      return count;
    }),
    clear: () => resets.clear(),
  };

  return repo;
}

export function hashToken(raw: string): string {
  return createHash('sha256').update(raw, 'utf8').digest('hex');
}
