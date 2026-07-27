import type { PasswordResetDocument } from './password-reset.schema';

export interface CreatePasswordResetPersistenceInput {
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}

export interface PasswordResetRepository {
  create(data: CreatePasswordResetPersistenceInput): Promise<PasswordResetDocument>;
  findActiveByTokenHash(tokenHash: string): Promise<PasswordResetDocument | null>;
  markUsed(id: string, usedAt?: Date): Promise<PasswordResetDocument | null>;
  invalidateAllForUser(userId: string): Promise<number>;
}
