import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../../auth/auth.module';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { PasswordResetsModule } from '../../password-resets/password-resets.module';
import { UsersModule } from '../../users/users.module';
import { AuthCookieService } from './auth-cookie.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_MAIL_PORT } from './ports/auth-mail.port';
import { NoopAuthMailAdapter } from './ports/noop-auth-mail.adapter';

@Module({
  imports: [AuthModule, UsersModule, PasswordResetsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookieService,
    {
      provide: AUTH_MAIL_PORT,
      useClass: NoopAuthMailAdapter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RolesGuard,
  ],
})
export class AuthHttpModule {}
