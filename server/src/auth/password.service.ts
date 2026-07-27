import { Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ARGON2_OPTIONS } from './auth.constants';
import type { Argon2RuntimeOptions } from './auth.types';

/**
 * Password hashing / verification (Argon2id). No HTTP; never logs secrets.
 */
@Injectable()
export class PasswordService {
  private readonly options: Argon2RuntimeOptions;

  constructor(@Inject(ARGON2_OPTIONS) options: Argon2RuntimeOptions) {
    this.options = options;
  }

  async hash(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: this.options.memoryCost,
      timeCost: this.options.timeCost,
      parallelism: this.options.parallelism,
    });
  }

  /**
   * Timing-safe verification via argon2.verify (constant-time compare of digests).
   */
  async verify(passwordHash: string, plainPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, plainPassword);
    } catch {
      return false;
    }
  }
}
