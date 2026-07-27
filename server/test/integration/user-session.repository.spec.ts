import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { Types } from 'mongoose';
import { Test } from '@nestjs/testing';
import { describeWithInfra } from '../../../tests/helpers/skip-without-infra.helper';
import { MongoSessionRepository } from '../../src/sessions/session.repository';
import { Session, SessionSchema } from '../../src/sessions/session.schema';
import { UserRole, UserStatus } from '../../src/users/user.enums';
import { MongoUserRepository } from '../../src/users/user.repository';
import { User, UserSchema } from '../../src/users/user.schema';

/**
 * Repository CRUD + index sync against real Mongo when TEST_DATABASE_URL is set.
 * Redis not required for M1 persistence tests.
 */
describeWithInfra(
  'UserRepository + SessionRepository (Mongo)',
  () => {
    let userRepo: MongoUserRepository;
    let sessionRepo: MongoSessionRepository;
    let connection: Connection;

    beforeAll(async () => {
      const uri = process.env.TEST_DATABASE_URL;
      if (!uri) {
        throw new Error('TEST_DATABASE_URL required for this suite');
      }

      const moduleRef = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(uri, {
            autoIndex: false,
            autoCreate: true,
          }),
          MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Session.name, schema: SessionSchema },
          ]),
        ],
        providers: [MongoUserRepository, MongoSessionRepository],
      }).compile();

      userRepo = moduleRef.get(MongoUserRepository);
      sessionRepo = moduleRef.get(MongoSessionRepository);
      connection = moduleRef.get(getConnectionToken());

      await connection.model(User.name).syncIndexes();
      await connection.model(Session.name).syncIndexes();
    });

    afterAll(async () => {
      if (connection) {
        await connection.dropDatabase();
        await connection.close();
      }
    });

    beforeEach(async () => {
      await connection.model(User.name).deleteMany({});
      await connection.model(Session.name).deleteMany({});
    });

    it('should_create_and_find_user_by_email', async () => {
      const created = await userRepo.create({
        email: 'Ada@Example.com',
        passwordHash: 'hash-not-a-real-argon2',
        name: 'Ada',
        role: UserRole.User,
        status: UserStatus.Active,
      });

      expect(created.email).toBe('ada@example.com');
      const found = await userRepo.findByEmail('ADA@example.com');
      expect(found?.id).toBe(created.id);
      await expect(userRepo.existsByEmail('ada@example.com')).resolves.toBe(true);
    });

    it('should_bump_token_version_and_update_password_hash', async () => {
      const created = await userRepo.create({
        email: 'bob@example.com',
        passwordHash: 'old-hash',
        name: 'Bob',
      });
      expect(created.tokenVersion).toBe(0);

      const bumped = await userRepo.bumpTokenVersion(created.id);
      expect(bumped?.tokenVersion).toBe(1);

      const updated = await userRepo.updatePasswordHash(created.id, 'new-hash');
      expect(updated?.passwordHash).toBe('new-hash');
    });

    it('should_enforce_unique_email', async () => {
      await userRepo.create({
        email: 'unique@example.com',
        passwordHash: 'h',
        name: 'One',
      });
      await expect(
        userRepo.create({
          email: 'unique@example.com',
          passwordHash: 'h2',
          name: 'Two',
        }),
      ).rejects.toThrow();
    });

    it('should_persist_session_and_query_active_by_user', async () => {
      const user = await userRepo.create({
        email: 'sess@example.com',
        passwordHash: 'h',
        name: 'Sess',
      });

      const expiresAt = new Date(Date.now() + 60_000);
      const session = await sessionRepo.create({
        userId: user.id,
        refreshTokenHash: `hash-${new Types.ObjectId().toHexString()}`,
        expiresAt,
        ip: '127.0.0.1',
        userAgent: 'jest',
      });

      const found = await sessionRepo.findByRefreshTokenHash(session.refreshTokenHash);
      expect(found?.id).toBe(session.id);

      const active = await sessionRepo.findActiveByUserId(user.id);
      expect(active).toHaveLength(1);
      expect(await sessionRepo.countActiveByUserId(user.id)).toBe(1);

      await sessionRepo.markRevoked(session.id, new Date());
      expect(await sessionRepo.countActiveByUserId(user.id)).toBe(0);
    });

    it('should_have_synced_user_and_session_indexes', async () => {
      const userIndexes = await connection.model(User.name).collection.indexes();
      const sessionIndexes = await connection.model(Session.name).collection.indexes();

      const userIndexNames = userIndexes.map((idx) => Object.keys(idx.key).join(','));
      expect(userIndexNames).toEqual(expect.arrayContaining(['email', 'role', 'status']));

      const sessionKeys = sessionIndexes.map((idx) => ({
        key: idx.key,
        unique: Boolean(idx.unique),
        expireAfterSeconds: idx.expireAfterSeconds,
      }));

      expect(sessionKeys).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: { refreshTokenHash: 1 }, unique: true }),
          expect.objectContaining({
            key: { userId: 1, revokedAt: 1, expiresAt: 1 },
          }),
          expect.objectContaining({
            key: { expiresAt: 1 },
            expireAfterSeconds: 0,
          }),
        ]),
      );
    });
  },
  { database: true, redis: false },
);
