import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, type UserDocument } from './user.schema';

/**
 * Ensures Mongo indexes for `users` exist (autoIndex is disabled globally).
 */
@Injectable()
export class UserIndexSyncService implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async onModuleInit(): Promise<void> {
    await this.userModel.syncIndexes();
  }
}
