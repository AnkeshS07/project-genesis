import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import type { AuthPrincipal } from '../modules/auth/auth.types';
import type { UserRole } from '../users/user.enums';
import { AuthHttpErrors } from '../modules/auth/auth-http.errors';

/**
 * Role-based guard skeleton — not applied to auth routes in M3.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthPrincipal }>();
    const user = request.user;
    if (!user) {
      throw AuthHttpErrors.invalidAccessToken();
    }

    return requiredRoles.includes(user.role);
  }
}
