import { Test } from '@nestjs/testing';
import {
  ARGON2_OPTIONS,
  DEFAULT_ARGON2_MEMORY_KIB,
  DEFAULT_ARGON2_PARALLELISM,
  DEFAULT_ARGON2_TIME_COST,
} from '../../../src/auth/auth.constants';
import { PasswordService } from '../../../src/auth/password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ARGON2_OPTIONS,
          useValue: {
            memoryCost: DEFAULT_ARGON2_MEMORY_KIB,
            timeCost: DEFAULT_ARGON2_TIME_COST,
            parallelism: DEFAULT_ARGON2_PARALLELISM,
          },
        },
      ],
    }).compile();

    service = moduleRef.get(PasswordService);
  });

  it('should_hash_and_verify_password_with_argon2id', async () => {
    const hash = await service.hash('correct-horse-battery-staple');
    expect(hash.startsWith('$argon2id$')).toBe(true);
    await expect(service.verify(hash, 'correct-horse-battery-staple')).resolves.toBe(true);
    await expect(service.verify(hash, 'wrong-password')).resolves.toBe(false);
  });

  it('should_return_false_for_malformed_hash', async () => {
    await expect(service.verify('not-a-hash', 'anything')).resolves.toBe(false);
  });

  it('should_produce_unique_salts_per_hash', async () => {
    const a = await service.hash('same-password-value');
    const b = await service.hash('same-password-value');
    expect(a).not.toBe(b);
  });
});
