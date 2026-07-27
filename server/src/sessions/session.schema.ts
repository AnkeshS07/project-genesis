import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

/**
 * Refresh-session persistence (Epic 01 M1).
 * No rotation / revocation orchestration — storage shape only.
 */
@Schema({
  collection: 'sessions',
  timestamps: true,
})
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  refreshTokenHash!: string;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date, default: null })
  revokedAt!: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Session', default: null })
  replacedBySessionId!: Types.ObjectId | null;

  @Prop({ type: String, default: null, maxlength: 64 })
  ip!: string | null;

  @Prop({ type: String, default: null, maxlength: 256 })
  userAgent!: string | null;

  @Prop({ type: String, default: null, maxlength: 120 })
  deviceLabel!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ refreshTokenHash: 1 }, { unique: true });
SessionSchema.index({ userId: 1, revokedAt: 1, expiresAt: 1 });
/** TTL: Mongo removes documents once `expiresAt` is in the past. */
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
