import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SESSION_REPOSITORY } from '../repositories/repository.tokens';
import { SessionIndexSyncService } from './session-index-sync.service';
import { MongoSessionRepository } from './session.repository';
import { Session, SessionSchema } from './session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [
    {
      provide: SESSION_REPOSITORY,
      useClass: MongoSessionRepository,
    },
    SessionIndexSyncService,
  ],
  exports: [MongooseModule, SESSION_REPOSITORY],
})
export class SessionsModule {}
