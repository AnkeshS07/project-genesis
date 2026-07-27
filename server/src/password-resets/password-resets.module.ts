import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PASSWORD_RESET_REPOSITORY } from '../repositories/repository.tokens';
import { PasswordResetIndexSyncService } from './password-reset-index-sync.service';
import { MongoPasswordResetRepository } from './password-reset.repository';
import { PasswordReset, PasswordResetSchema } from './password-reset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PasswordReset.name, schema: PasswordResetSchema }]),
  ],
  providers: [
    {
      provide: PASSWORD_RESET_REPOSITORY,
      useClass: MongoPasswordResetRepository,
    },
    PasswordResetIndexSyncService,
  ],
  exports: [MongooseModule, PASSWORD_RESET_REPOSITORY],
})
export class PasswordResetsModule {}
