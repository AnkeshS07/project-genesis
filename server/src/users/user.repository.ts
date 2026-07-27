import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../repositories/base.repository';
import type { UserStatus } from './user.enums';
import type {
  CreateUserPersistenceInput,
  UserRepository,
} from './user.repository.interface';
import { User, type UserDocument } from './user.schema';

@Injectable()
export class MongoUserRepository
  extends BaseRepository<UserDocument>
  implements UserRepository
{
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async create(data: CreateUserPersistenceInput): Promise<UserDocument> {
    return this.insert({
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name.trim(),
      role: data.role,
      status: data.status,
      tokenVersion: data.tokenVersion ?? 0,
      lockUntil: data.lockUntil ?? null,
    });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.trim().toLowerCase() });
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<UserDocument | null> {
    return this.updateById(id, { $set: { passwordHash } });
  }

  async bumpTokenVersion(id: string): Promise<UserDocument | null> {
    return this.updateById(id, { $inc: { tokenVersion: 1 } });
  }

  async updateStatus(
    id: string,
    status: UserStatus,
    lockUntil: Date | null = null,
  ): Promise<UserDocument | null> {
    return this.updateById(id, { $set: { status, lockUntil } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email: email.trim().toLowerCase() });
  }
}
