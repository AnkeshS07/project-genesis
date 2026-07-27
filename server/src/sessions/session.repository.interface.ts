import type { Types } from 'mongoose';
import type { SessionDocument } from './session.schema';

export interface CreateSessionPersistenceInput {
  readonly userId: Types.ObjectId | string;
  readonly refreshTokenHash: string;
  readonly expiresAt: Date;
  readonly revokedAt?: Date | null;
  readonly replacedBySessionId?: Types.ObjectId | string | null;
  readonly ip?: string | null;
  readonly userAgent?: string | null;
  readonly deviceLabel?: string | null;
}

export interface SessionRepository {
  create(data: CreateSessionPersistenceInput): Promise<SessionDocument>;
  findById(id: string): Promise<SessionDocument | null>;
  findByRefreshTokenHash(hash: string): Promise<SessionDocument | null>;
  findActiveByUserId(userId: string, options?: { limit?: number }): Promise<SessionDocument[]>;
  markRevoked(id: string, revokedAt: Date): Promise<SessionDocument | null>;
  setReplacedBy(id: string, replacedBySessionId: string): Promise<SessionDocument | null>;
  countActiveByUserId(userId: string): Promise<number>;
}
