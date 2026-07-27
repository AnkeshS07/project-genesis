import type { UserDocument } from './user.schema';
import type { UserRole, UserStatus } from './user.enums';

export interface CreateUserPersistenceInput {
  readonly email: string;
  readonly passwordHash: string;
  readonly name: string;
  readonly role?: UserRole;
  readonly status?: UserStatus;
  readonly tokenVersion?: number;
  readonly lockUntil?: Date | null;
}

export interface UserRepository {
  create(data: CreateUserPersistenceInput): Promise<UserDocument>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  updatePasswordHash(id: string, passwordHash: string): Promise<UserDocument | null>;
  bumpTokenVersion(id: string): Promise<UserDocument | null>;
  updateStatus(
    id: string,
    status: UserStatus,
    lockUntil?: Date | null,
  ): Promise<UserDocument | null>;
  existsByEmail(email: string): Promise<boolean>;
}
