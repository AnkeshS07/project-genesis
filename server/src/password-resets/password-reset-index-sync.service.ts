import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordReset, type PasswordResetDocument } from './password-reset.schema';

/**
 * Ensures Mongo indexes for `password_resets` exist (autoIndex is disabled globally).
 */
@Injectable()
export class PasswordResetIndexSyncService implements OnModuleInit {
  constructor(
    @InjectModel(PasswordReset.name) private readonly passwordResetModel: Model<PasswordResetDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.passwordResetModel.syncIndexes();
  }
}
