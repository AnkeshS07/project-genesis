import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../repositories/base.repository';
import type {
  CreateSessionPersistenceInput,
  SessionRepository,
} from './session.repository.interface';
import { Session, type SessionDocument } from './session.schema';

@Injectable()
export class MongoSessionRepository
  extends BaseRepository<SessionDocument>
  implements SessionRepository
{
  constructor(@InjectModel(Session.name) model: Model<SessionDocument>) {
    super(model);
  }

  async create(data: CreateSessionPersistenceInput): Promise<SessionDocument> {
    const userId =
      typeof data.userId === 'string' ? new Types.ObjectId(data.userId) : data.userId;
    const replacedBySessionId =
      data.replacedBySessionId === undefined || data.replacedBySessionId === null
        ? null
        : typeof data.replacedBySessionId === 'string'
          ? new Types.ObjectId(data.replacedBySessionId)
          : data.replacedBySessionId;

    return this.insert({
      userId,
      refreshTokenHash: data.refreshTokenHash,
      expiresAt: data.expiresAt,
      revokedAt: data.revokedAt ?? null,
      replacedBySessionId,
      ip: data.ip ?? null,
      userAgent: data.userAgent ?? null,
      deviceLabel: data.deviceLabel ?? null,
    });
  }

  async findByRefreshTokenHash(hash: string): Promise<SessionDocument | null> {
    return this.findOne({ refreshTokenHash: hash });
  }

  async findActiveByUserId(
    userId: string,
    options?: { limit?: number },
  ): Promise<SessionDocument[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }
    const now = new Date();
    const queryOptions: { limit?: number; sort: Record<string, 1 | -1> } = {
      sort: { createdAt: 1 },
    };
    if (typeof options?.limit === 'number') {
      queryOptions.limit = options.limit;
    }
    return this.findMany(
      {
        userId: new Types.ObjectId(userId),
        revokedAt: null,
        expiresAt: { $gt: now },
      },
      queryOptions,
    );
  }

  async markRevoked(id: string, revokedAt: Date): Promise<SessionDocument | null> {
    return this.updateById(id, { $set: { revokedAt } });
  }

  async setReplacedBy(id: string, replacedBySessionId: string): Promise<SessionDocument | null> {
    if (!Types.ObjectId.isValid(replacedBySessionId)) {
      return null;
    }
    return this.updateById(id, {
      $set: { replacedBySessionId: new Types.ObjectId(replacedBySessionId) },
    });
  }

  async countActiveByUserId(userId: string): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      return 0;
    }
    const now = new Date();
    return this.count({
      userId: new Types.ObjectId(userId),
      revokedAt: null,
      expiresAt: { $gt: now },
    });
  }
}
