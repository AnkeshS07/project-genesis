import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../users/user.enums';

export const ROLES_KEY = 'roles';

/** Required roles for RolesGuard (skeleton — not wired on auth routes in M3). */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
