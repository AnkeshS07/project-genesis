import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolveEnvFilePaths, validateEnv } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolveEnvFilePaths(),
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}
