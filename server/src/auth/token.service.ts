import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import type { EnvConfig } from '../config/env.validation';
import type { UserRole } from '../users/user.enums';
import { InvalidAccessTokenError, TokenVersionMismatchError } from './auth.errors';
import type { AccessTokenClaims, VerifiedAccessToken } from './auth.types';
import { parseDurationToSeconds } from './duration.util';

interface JwtPayloadShape {
  sub?: unknown;
  role?: unknown;
  tokenVersion?: unknown;
  iat?: unknown;
  exp?: unknown;
  jti?: unknown;
}

/**
 * Access JWT only (HS256). Refresh tokens are opaque — handled by SessionService.
 */
@Injectable()
export class TokenService {
  private readonly accessExpiresInSeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    config: ConfigService<EnvConfig, true>,
  ) {
    this.accessExpiresInSeconds = parseDurationToSeconds(
      config.get('JWT_ACCESS_EXPIRES_IN', { infer: true }),
    );
  }

  async signAccessToken(claims: AccessTokenClaims): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: claims.sub,
        role: claims.role,
        tokenVersion: claims.tokenVersion,
      },
      {
        expiresIn: this.accessExpiresInSeconds,
        jwtid: randomUUID(),
      },
    );
  }

  async verifyAccessToken(
    token: string,
    expectedTokenVersion?: number,
  ): Promise<VerifiedAccessToken> {
    let payload: JwtPayloadShape;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayloadShape>(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error;
      }
      throw new InvalidAccessTokenError();
    }

    const verified = this.mapPayload(payload);

    if (
      expectedTokenVersion !== undefined &&
      verified.tokenVersion !== expectedTokenVersion
    ) {
      throw new TokenVersionMismatchError();
    }

    return verified;
  }

  private mapPayload(payload: JwtPayloadShape): VerifiedAccessToken {
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.tokenVersion !== 'number' ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      throw new InvalidAccessTokenError('Access token claims are malformed');
    }

    const result: VerifiedAccessToken = {
      sub: payload.sub,
      role: payload.role as UserRole,
      tokenVersion: payload.tokenVersion,
      iat: payload.iat,
      exp: payload.exp,
    };

    if (typeof payload.jti === 'string') {
      return { ...result, jti: payload.jti };
    }

    return result;
  }
}
