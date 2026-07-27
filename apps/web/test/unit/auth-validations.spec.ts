import { loginSchema, registerSchema } from '@/features/auth/validations';

describe('auth validations', () => {
  it('validates login input', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password1',
    });

    expect(result.success).toBe(true);
  });

  it('rejects mismatched register passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Jane Doe',
      email: 'user@example.com',
      password: 'password1',
      confirmPassword: 'password2',
    });

    expect(result.success).toBe(false);
  });
});
