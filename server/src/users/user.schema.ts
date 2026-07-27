import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole, UserStatus } from './user.enums';

export type UserDocument = HydratedDocument<User>;

/**
 * Identity-only user document (Epic 01 M1).
 * No workspace fields, no profile preferences, no business aggregates.
 */
@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  name!: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.User,
  })
  role!: UserRole;

  @Prop({
    type: String,
    enum: Object.values(UserStatus),
    required: true,
    default: UserStatus.Active,
  })
  status!: UserStatus;

  /** Bumped on password reset / global revoke (JWT invalidation). Persistence only in M1. */
  @Prop({ type: Number, required: true, default: 0, min: 0 })
  tokenVersion!: number;

  /** Optional lock expiry for future failed-login policy (M2+). */
  @Prop({ type: Date, default: null })
  lockUntil!: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
