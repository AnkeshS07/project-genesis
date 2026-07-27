import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { EnvConfig } from '../../config/env.validation';
import { parseDurationToSeconds } from '../../auth/duration.util';

export interface RefreshCookieConfig {
  readonly name: string;
  readonly path: string;
  readonly secure: boolean;
  readonly sameSite: 'strict' | 'lax' | 'none';
  readonly maxAgeSeconds: number;
}

@Injectable()
export class AuthCookieService {
  private readonly config: RefreshCookieConfig;

  constructor(configService: ConfigService<EnvConfig, true>) {
    const nodeEnv = configService.get('NODE_ENV', { infer: true });
    this.config = {
      name: configService.get('AUTH_REFRESH_COOKIE_NAME', { infer: true }),
      path: configService.get('AUTH_REFRESH_COOKIE_PATH', { infer: true }),
      secure: nodeEnv === 'production',
      sameSite: configService.get('AUTH_COOKIE_SAMESITE', { infer: true }),
      maxAgeSeconds: parseDurationToSeconds(
        configService.get('JWT_REFRESH_EXPIRES_IN', { infer: true }),
      ),
    };
  }

  readRefreshToken(request: Request): string | undefined {
    const value = request.cookies?.[this.config.name];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  setRefreshToken(response: Response, rawRefreshToken: string): void {
    response.cookie(this.config.name, rawRefreshToken, {
      httpOnly: true,
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      path: this.config.path,
      maxAge: this.config.maxAgeSeconds * 1000,
    });
  }

  clearRefreshToken(response: Response): void {
    response.clearCookie(this.config.name, {
      httpOnly: true,
      secure: this.config.secure,
      sameSite: this.config.sameSite,
      path: this.config.path,
    });
  }
}
