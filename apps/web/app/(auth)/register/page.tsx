'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAlert } from '@/components/auth/auth-alert';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthCard } from '@/components/auth/auth-card';
import { AuthField } from '@/components/auth/auth-field';
import { PublicOnly } from '@/components/auth/public-only';
import { mapAuthError } from '@/features/auth/map-auth-error';
import { registerSchema, type RegisterFormValues } from '@/features/auth/validations';
import { useAuth } from '@/features/auth/use-auth';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/auth/constants';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await registerUser(values.name, values.email, values.password);
      router.push(PROTECTED_ROUTES.account);
    } catch (error) {
      setFormError(mapAuthError(error, 'Unable to create your account.'));
    }
  });

  return (
    <PublicOnly>
      <AuthCard
        title="Create your Genesis account"
        description="Structured creative work starts with a calm, focused workspace."
      >
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {formError ? <AuthAlert message={formError} /> : null}

          <AuthField
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />

          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <AuthField
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <AuthField
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <AuthButton type="submit" loading={isSubmitting}>
            Create account
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-paper/70">
          Already have an account?{' '}
          <Link href={AUTH_ROUTES.login} className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </PublicOnly>
  );
}
