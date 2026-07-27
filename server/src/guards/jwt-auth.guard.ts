import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { TokenVersionMismatchError } from '../auth/auth.errors';
import { TokenService } from '../auth/token.service';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { AuthHttpErrors } from '../modules/auth/auth-http.errors';
import type { AuthPrincipal } from '../modules/auth/auth.types';
import { USER_REPOSITORY } from '../repositories/repository.tokens';
import { UserStatus } from '../users/user.enums';
import type { UserRepository } from '../users/user.repository.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthPrincipal }>();
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw AuthHttpErrors.invalidAccessToken();
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw AuthHttpErrors.invalidAccessToken();
    }

    try {
      const verified = await this.tokenService.verifyAccessToken(token);
      const user = await this.users.findById(verified.sub);
      if (!user) {
        throw AuthHttpErrors.userNotFound();
      }

      if (user.tokenVersion !== verified.tokenVersion) {
        throw AuthHttpErrors.tokenVersionMismatch();
      }

      if (user.status === UserStatus.Disabled) {
        throw AuthHttpErrors.accountDisabled();
      }

      if (
        user.status === UserStatus.Locked ||
        (user.lockUntil !== null && user.lockUntil.getTime() > Date.now())
      ) {
        throw AuthHttpErrors.accountLocked();
      }

      request.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        tokenVersion: user.tokenVersion,
      };

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof TokenVersionMismatchError) {
        throw AuthHttpErrors.tokenVersionMismatch();
      }
      if (error instanceof TokenExpiredError) {
        throw AuthHttpErrors.tokenExpired();
      }
      const message = error instanceof Error ? error.message.toLowerCase() : '';
      if (message.includes('expired') || message.includes('jwt expired')) {
        throw AuthHttpErrors.tokenExpired();
      }
      throw AuthHttpErrors.invalidAccessToken();
    }
  }
}
