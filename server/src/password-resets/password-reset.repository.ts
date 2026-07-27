import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../repositories/base.repository';
import type {
  CreatePasswordResetPersistenceInput,
  PasswordResetRepository,
} from './password-reset.repository.interface';
import { PasswordReset, type PasswordResetDocument } from './password-reset.schema';

@Injectable()
export class MongoPasswordResetRepository
  extends BaseRepository<PasswordResetDocument>
  implements PasswordResetRepository
{
  constructor(@InjectModel(PasswordReset.name) model: Model<PasswordResetDocument>) {
    super(model);
  }

  async create(data: CreatePasswordResetPersistenceInput): Promise<PasswordResetDocument> {
    return this.insert({
      userId: new Types.ObjectId(data.userId),
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      usedAt: null,
    });
  }

  async findActiveByTokenHash(tokenHash: string): Promise<PasswordResetDocument | null> {
    const now = new Date();
    return this.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: now },
    });
  }

  async markUsed(id: string, usedAt: Date = new Date()): Promise<PasswordResetDocument | null> {
    return this.updateById(id, { $set: { usedAt } });
  }

  async invalidateAllForUser(userId: string): Promise<number> {
    const now = new Date();
    const result = await this.model.updateMany(
      { userId, usedAt: null },
      { $set: { usedAt: now } },
    );
    return result.modifiedCount;
  }
}
