import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, type SessionDocument } from './session.schema';

/**
 * Ensures Mongo indexes for `sessions` exist (autoIndex is disabled globally).
 */
@Injectable()
export class SessionIndexSyncService implements OnModuleInit {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>) {}

  async onModuleInit(): Promise<void> {
    await this.sessionModel.syncIndexes();
  }
}
