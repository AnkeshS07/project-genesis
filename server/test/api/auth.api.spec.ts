import {
  HttpStatus,
  type INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { ARGON2_OPTIONS, AUTH_MAX_ACTIVE_SESSIONS } from '../../src/auth/auth.constants';
import { PasswordService } from '../../src/auth/password.service';
import { SessionService } from '../../src/auth/session.service';
import { TokenService } from '../../src/auth/token.service';
import { GlobalExceptionFilter } from '../../src/common/filters/global-exception.filter';
import { ResponseEnvelopeInterceptor } from '../../src/common/interceptors/response-envelope.interceptor';
import type { EnvConfig } from '../../src/config/env.validation';
import { JwtAuthGuard } from '../../src/guards/jwt-auth.guard';
import { AuthCookieService } from '../../src/modules/auth/auth-cookie.service';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { AUTH_MAIL_PORT } from '../../src/modules/auth/ports/auth-mail.port';
import type { PasswordResetRepository } from '../../src/password-resets/password-reset.repository.interface';
import {
  PASSWORD_RESET_REPOSITORY,
  SESSION_REPOSITORY,
  USER_REPOSITORY,
} from '../../src/repositories/repository.tokens';
import type { SessionRepository } from '../../src/sessions/session.repository.interface';
import { CorrelationMiddleware } from '../../src/telemetry/correlation/correlation.middleware';
import { TELEMETRY_SERVICE_KIND } from '../../src/telemetry/telemetry.constants';
import { TelemetryModule } from '../../src/telemetry/telemetry.module';
import { UserStatus } from '../../src/users/user.enums';
import type { UserRepository } from '../../src/users/user.repository.interface';
import {
  createInMemoryPasswordResetRepository,
  createInMemorySessionRepository,
  createInMemoryUserRepository,
} from '../../../tests/mocks/auth-repositories.mock';
import { createAppLoggerMock } from '../../../tests/mocks/logger.mock';
import { testEnvFixture } from '../../../tests/fixtures/env.fixture';

const REFRESH_COOKIE = 'refresh_token';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          ...testEnvFixture,
          AUTH_ARGON2_MEMORY_KIB: 8192,
          AUTH_ARGON2_TIME_COST: 1,
          AUTH_ARGON2_PARALLELISM: 1,
        }),
      ],
    }),
    TelemetryModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookieService,
    PasswordService,
    TokenService,
    SessionService,
    JwtAuthGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: TELEMETRY_SERVICE_KIND, useValue: 'api' },
    {
      provide: ARGON2_OPTIONS,
      useValue: { memoryCost: 8192, timeCost: 1, parallelism: 1 },
    },
    { provide: AUTH_MAX_ACTIVE_SESSIONS, useValue: 10 },
    {
      provide: AUTH_MAIL_PORT,
      useValue: { sendPasswordReset: jest.fn().mockResolvedValue(undefined) },
    },
    {
      provide: GlobalExceptionFilter,
      useFactory: () => new GlobalExceptionFilter(createAppLoggerMock() as never),
    },
    ResponseEnvelopeInterceptor,
    { provide: USER_REPOSITORY, useValue: null },
    { provide: SESSION_REPOSITORY, useValue: null },
    { provide: PASSWORD_RESET_REPOSITORY, useValue: null },
  ],
})
class AuthApiTestModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}

describe('Auth API', () => {
  let app: INestApplication;
  let userRepo: jest.Mocked<UserRepository> & { clear: () => void };
  let sessionRepo: jest.Mocked<SessionRepository> & { clear: () => void };
  let passwordResetRepo: jest.Mocked<PasswordResetRepository> & { clear: () => void };
  let mailPort: { sendPasswordReset: jest.Mock };

  beforeAll(async () => {
    userRepo = createInMemoryUserRepository();
    sessionRepo = createInMemorySessionRepository();
    passwordResetRepo = createInMemoryPasswordResetRepository();

    const moduleRef = await Test.createTestingModule({
      imports: [AuthApiTestModule],
    })
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepo)
      .overrideProvider(SESSION_REPOSITORY)
      .useValue(sessionRepo)
      .overrideProvider(PASSWORD_RESET_REPOSITORY)
      .useValue(passwordResetRepo)
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    app.useGlobalFilters(app.get(GlobalExceptionFilter));
    app.useGlobalInterceptors(app.get(ResponseEnvelopeInterceptor));
    app.setGlobalPrefix('api/v1');
    await app.init();

    mailPort = moduleRef.get(AUTH_MAIL_PORT);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo.clear();
    sessionRepo.clear();
    passwordResetRepo.clear();
  });

  function extractRefreshCookie(setCookieHeader: string | string[] | undefined): string {
    const header = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    expect(header).toBeDefined();
    const match = header?.match(new RegExp(`${REFRESH_COOKIE}=([^;]+)`));
    expect(match?.[1]).toBeDefined();
    return `${REFRESH_COOKIE}=${match![1]}`;
  }

  it('should_register_user_and_set_refresh_cookie', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      })
      .expect(201);

    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          email: 'new@example.com',
          name: 'New User',
          status: 'active',
        },
        accessToken: expect.any(String),
      },
    });
    expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_COOKIE}=`);
    expect(res.headers['set-cookie']?.[0]).toContain('HttpOnly');
  });

  it('should_reject_duplicate_email', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'dup@example.com', password: 'password123', name: 'One' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'dup@example.com', password: 'password123', name: 'Two' })
      .expect(409);

    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('should_login_with_valid_credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'login@example.com', password: 'password123', name: 'Login User' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'password123' })
      .expect(200);

    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.user.email).toBe('login@example.com');
  });

  it('should_reject_invalid_password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'bad@example.com', password: 'password123', name: 'Bad Login' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'bad@example.com', password: 'wrong-password' })
      .expect(401);

    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should_refresh_access_token_with_cookie', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'refresh@example.com', password: 'password123', name: 'Refresh User' })
      .expect(201);

    const cookie = extractRefreshCookie(register.headers['set-cookie']);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.accessToken).not.toBe(register.body.data.accessToken);
    expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_COOKIE}=`);
  });

  it('should_logout_and_clear_cookie', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'logout@example.com', password: 'password123', name: 'Logout User' })
      .expect(201);

    const cookie = extractRefreshCookie(register.headers['set-cookie']);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body.data.message).toBe('Logged out');
    expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_COOKIE}=;`);
  });

  it('should_logout_all_sessions_for_authenticated_user', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'logoutall@example.com', password: 'password123', name: 'Logout All' })
      .expect(201);

    const accessToken = register.body.data.accessToken as string;

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/logout-all')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.message).toBe('All sessions revoked');

    const me = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);

    expect(me.body.error.code).toBe('TOKEN_VERSION_MISMATCH');
  });

  it('should_return_generic_success_for_forgot_password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'forgot@example.com', password: 'password123', name: 'Forgot User' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'forgot@example.com' })
      .expect(200);

    expect(res.body.data.message).toContain('reset link');
    expect(mailPort.sendPasswordReset).toHaveBeenCalled();
  });

  it('should_reset_password_and_invalidate_sessions', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'reset@example.com', password: 'password123', name: 'Reset User' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'reset@example.com' })
      .expect(200);

    const rawToken = mailPort.sendPasswordReset.mock.calls[0]?.[1] as string;
    expect(rawToken).toBeDefined();

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/reset-password')
      .send({ token: rawToken, password: 'newpassword99' })
      .expect(200);

    expect(res.body.data.message).toBe('Password has been reset');

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'reset@example.com', password: 'newpassword99' })
      .expect(200);
  });

  it('should_return_me_for_authenticated_user', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'me@example.com', password: 'password123', name: 'Me User' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${register.body.data.accessToken}`)
      .expect(200);

    expect(res.body.data).toMatchObject({
      email: 'me@example.com',
      name: 'Me User',
      status: 'active',
    });
    expect(res.body.data).not.toHaveProperty('passwordHash');
    expect(res.body.data).not.toHaveProperty('tokenVersion');
  });

  it('should_reject_me_without_token', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    expect(res.body.error.code).toBe('INVALID_ACCESS_TOKEN');
  });

  it('should_reject_validation_errors', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'short', name: '' })
      .expect(422);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should_reject_disabled_account_on_login', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'disabled@example.com', password: 'password123', name: 'Disabled' })
      .expect(201);

    const userId = register.body.data.user.id as string;
    await userRepo.updateStatus(userId, UserStatus.Disabled);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'disabled@example.com', password: 'password123' })
      .expect(403);

    expect(res.body.error.code).toBe('ACCOUNT_DISABLED');
  });

  it('should_reject_refresh_without_cookie', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/auth/refresh').expect(401);
    expect(res.body.error.code).toBe('REFRESH_INVALID');
  });

  it('should_reject_revoked_refresh_token', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'revoked@example.com', password: 'password123', name: 'Revoked' })
      .expect(201);

    const cookie = extractRefreshCookie(register.headers['set-cookie']);
    await request(app.getHttpServer()).post('/api/v1/auth/logout').set('Cookie', cookie).expect(200);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookie)
      .expect(401);

    expect(res.body.error.code).toBe('REFRESH_REUSED');
  });

  it('should_reject_expired_access_token', async () => {
    const token = sign(
      { sub: 'user-id', role: 'user', tokenVersion: 0 },
      testEnvFixture.JWT_SECRET,
      { expiresIn: -1 },
    );

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(res.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('should_reject_stale_token_version', async () => {
    const register = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'stale@example.com', password: 'password123', name: 'Stale Token' })
      .expect(201);

    await userRepo.bumpTokenVersion(register.body.data.user.id);

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${register.body.data.accessToken}`)
      .expect(401);

    expect(res.body.error.code).toBe('TOKEN_VERSION_MISMATCH');
  });
});
