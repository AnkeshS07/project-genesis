import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { EnvConfig } from '../config/env.validation';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import {
  ARGON2_OPTIONS,
  AUTH_MAX_ACTIVE_SESSIONS,
  DEFAULT_ARGON2_MEMORY_KIB,
  DEFAULT_ARGON2_PARALLELISM,
  DEFAULT_ARGON2_TIME_COST,
  DEFAULT_MAX_ACTIVE_SESSIONS,
} from './auth.constants';
import type { Argon2RuntimeOptions } from './auth.types';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    SessionsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
      }),
    }),
  ],
  providers: [
    {
      provide: ARGON2_OPTIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>): Argon2RuntimeOptions => ({
        memoryCost: config.get('AUTH_ARGON2_MEMORY_KIB', { infer: true }),
        timeCost: config.get('AUTH_ARGON2_TIME_COST', { infer: true }),
        parallelism: config.get('AUTH_ARGON2_PARALLELISM', { infer: true }),
      }),
    },
    {
      provide: AUTH_MAX_ACTIVE_SESSIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>): number =>
        config.get('AUTH_MAX_ACTIVE_SESSIONS', { infer: true }) ?? DEFAULT_MAX_ACTIVE_SESSIONS,
    },
    PasswordService,
    TokenService,
    SessionService,
  ],
  exports: [PasswordService, TokenService, SessionService, JwtModule],
})
export class AuthModule {}

/** Re-export defaults for tests that construct options without DI. */
export const argon2FallbackDefaults: Argon2RuntimeOptions = {
  memoryCost: DEFAULT_ARGON2_MEMORY_KIB,
  timeCost: DEFAULT_ARGON2_TIME_COST,
  parallelism: DEFAULT_ARGON2_PARALLELISM,
};
