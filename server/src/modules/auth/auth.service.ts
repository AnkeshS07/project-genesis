import { createHash, randomBytes } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InvalidRefreshTokenError,
  RefreshTokenReuseError,
} from '../../auth/auth.errors';
import { PasswordService } from '../../auth/password.service';
import { SessionService } from '../../auth/session.service';
import { TokenService } from '../../auth/token.service';
import { parseDurationToMs } from '../../auth/duration.util';
import type { EnvConfig } from '../../config/env.validation';
import type { PasswordResetRepository } from '../../password-resets/password-reset.repository.interface';
import {
  PASSWORD_RESET_REPOSITORY,
  USER_REPOSITORY,
} from '../../repositories/repository.tokens';
import type { UserDocument } from '../../users/user.schema';
import type { UserRepository } from '../../users/user.repository.interface';
import { UserRole, UserStatus } from '../../users/user.enums';
import { AuthHttpErrors } from './auth-http.errors';
import type {
  AuthPrincipal,
  AuthSessionMetadata,
  AuthSessionResult,
  RefreshSessionResult,
  SafeAuthUser,
} from './auth.types';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import { AUTH_MAIL_PORT, type AuthMailPort } from './ports/auth-mail.port';

const RESET_TOKEN_BYTES = 32;

@Injectable()
export class AuthService {
  private readonly resetTtlMs: number;

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_RESET_REPOSITORY) private readonly passwordResets: PasswordResetRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
    @Inject(AUTH_MAIL_PORT) private readonly authMail: AuthMailPort,
    config: ConfigService<EnvConfig, true>,
  ) {
    this.resetTtlMs = parseDurationToMs(
      config.get('AUTH_PASSWORD_RESET_EXPIRES_IN', { infer: true }),
    );
  }

  async register(dto: RegisterDto, metadata: AuthSessionMetadata): Promise<AuthSessionResult> {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.existsByEmail(email)) {
      throw AuthHttpErrors.emailTaken();
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const user = await this.users.create({
      email,
      passwordHash,
      name: dto.name.trim(),
      role: UserRole.User,
      status: UserStatus.Active,
    });

    return this.issueSessionForUser(user, metadata);
  }

  async login(dto: LoginDto, metadata: AuthSessionMetadata): Promise<AuthSessionResult> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw AuthHttpErrors.invalidCredentials();
    }

    const valid = await this.passwordService.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw AuthHttpErrors.invalidCredentials();
    }

    this.assertUserCanAuthenticate(user);
    return this.issueSessionForUser(user, metadata);
  }

  async refresh(rawRefreshToken: string, metadata: AuthSessionMetadata): Promise<RefreshSessionResult> {
    if (!rawRefreshToken) {
      throw AuthHttpErrors.refreshInvalid();
    }

    try {
      const rotated = await this.sessionService.rotateRefreshToken(rawRefreshToken, metadata);
      const user = await this.users.findById(rotated.userId);
      if (!user) {
        throw AuthHttpErrors.refreshInvalid();
      }

      this.assertUserCanAuthenticate(user);
      const accessToken = await this.tokenService.signAccessToken({
        sub: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
      });

      return {
        accessToken,
        rawRefreshToken: rotated.rawRefreshToken,
      };
    } catch (error) {
      if (error instanceof RefreshTokenReuseError) {
        throw AuthHttpErrors.refreshReused();
      }
      if (error instanceof InvalidRefreshTokenError) {
        throw AuthHttpErrors.refreshInvalid(error.message);
      }
      throw error;
    }
  }

  async logout(rawRefreshToken: string | undefined): Promise<{ message: string }> {
    if (rawRefreshToken) {
      const session = await this.sessionService.findSessionByRawRefreshToken(rawRefreshToken);
      if (session && session.revokedAt === null) {
        await this.sessionService.markRevoked(session.id);
      }
    }

    return { message: 'Logged out' };
  }

  async logoutAll(user: AuthPrincipal): Promise<{ message: string }> {
    await this.sessionService.revokeAllSessionsForUser(user.id);
    await this.users.bumpTokenVersion(user.id);
    return { message: 'All sessions revoked' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (user) {
      const rawToken = this.generateResetToken();
      const tokenHash = this.hashResetToken(rawToken);
      await this.passwordResets.invalidateAllForUser(user.id);
      await this.passwordResets.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + this.resetTtlMs),
      });
      await this.authMail.sendPasswordReset(user.email, rawToken);
    }

    return { message: AuthHttpErrors.genericSuccessMessage };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.hashResetToken(dto.token);
    const resetRecord = await this.passwordResets.findActiveByTokenHash(tokenHash);
    if (!resetRecord) {
      throw AuthHttpErrors.resetTokenInvalid();
    }

    const user = await this.users.findById(String(resetRecord.userId));
    if (!user) {
      throw AuthHttpErrors.resetTokenInvalid();
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    await this.users.updatePasswordHash(user.id, passwordHash);
    await this.users.bumpTokenVersion(user.id);
    await this.sessionService.revokeAllSessionsForUser(user.id);
    await this.passwordResets.markUsed(resetRecord.id);

    return { message: 'Password has been reset' };
  }

  getMe(user: AuthPrincipal): SafeAuthUser {
    return this.toSafeUser(user);
  }

  private async issueSessionForUser(
    user: UserDocument,
    metadata: AuthSessionMetadata,
  ): Promise<AuthSessionResult> {
    const session = await this.sessionService.createSession(user.id, metadata);
    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    return {
      user: this.toSafeUser(user),
      accessToken,
      rawRefreshToken: session.rawRefreshToken,
    };
  }

  private assertUserCanAuthenticate(user: UserDocument | AuthPrincipal): void {
    if (user.status === UserStatus.Disabled) {
      throw AuthHttpErrors.accountDisabled();
    }
    const lockUntil = 'lockUntil' in user ? user.lockUntil : null;
    if (
      user.status === UserStatus.Locked ||
      (lockUntil !== null && lockUntil !== undefined && lockUntil.getTime() > Date.now())
    ) {
      throw AuthHttpErrors.accountLocked();
    }
  }

  private toSafeUser(user: UserDocument | AuthPrincipal): SafeAuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }

  private generateResetToken(): string {
    return randomBytes(RESET_TOKEN_BYTES).toString('base64url');
  }

  private hashResetToken(rawToken: string): string {
    return createHash('sha256').update(rawToken, 'utf8').digest('hex');
  }
}
