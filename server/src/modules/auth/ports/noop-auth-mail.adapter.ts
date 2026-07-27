import { Injectable } from '@nestjs/common';
import type { AuthMailPort } from './auth-mail.port';

/** Placeholder mail adapter — concrete provider deferred to Epic 01 M5. */
@Injectable()
export class NoopAuthMailAdapter implements AuthMailPort {
  async sendPasswordReset(): Promise<void> {
    // Intentionally no-op until an approved mail provider is wired.
  }
}
