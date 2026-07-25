import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import type { EnvConfig } from '../config/env.validation';

/**
 * MongoDB connection via Mongoose (Architecture 1.1).
 * Connection only — no schemas, models, or repositories in M5.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => {
        const uri = config.get('DATABASE_URL', { infer: true });
        return {
          uri,
          serverSelectionTimeoutMS: 10_000,
          maxPoolSize: 10,
          autoIndex: false,
          autoCreate: false,
        };
      },
    }),
  ],
})
export class MongoModule {}
