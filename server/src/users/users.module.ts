import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_REPOSITORY } from '../repositories/repository.tokens';
import { UserIndexSyncService } from './user-index-sync.service';
import { MongoUserRepository } from './user.repository';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    UserIndexSyncService,
  ],
  exports: [MongooseModule, USER_REPOSITORY],
})
export class UsersModule {}
