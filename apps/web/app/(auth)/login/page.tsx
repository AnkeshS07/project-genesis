'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAlert } from '@/components/auth/auth-alert';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthCard } from '@/components/auth/auth-card';
import { AuthField } from '@/components/auth/auth-field';
import { PublicOnly } from '@/components/auth/public-only';
import { mapAuthError } from '@/features/auth/map-auth-error';
import { loginSchema, type LoginFormValues } from '@/features/auth/validations';
import { useAuth } from '@/features/auth/use-auth';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/auth/constants';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-ink-muted dark:text-paper/70">Loading sign in…</div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await login(values.email, values.password);
      const next = searchParams.get('next');
      router.push(next && next.startsWith('/') ? next : PROTECTED_ROUTES.account);
    } catch (error) {
      setFormError(mapAuthError(error, 'Unable to sign in.'));
    }
  });

  return (
    <PublicOnly>
      <AuthCard title="Welcome back" description="Sign in to continue your creative work.">
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {formError ? <AuthAlert message={formError} /> : null}

          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link
                href={AUTH_ROUTES.forgotPassword}
                className="text-sm text-accent hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-paper/20 dark:bg-ink/40"
              {...register('password')}
            />
            {errors.password?.message ? (
              <p className="text-sm text-red-700 dark:text-red-300">{errors.password.message}</p>
            ) : null}
          </div>

          <AuthButton type="submit" loading={isSubmitting}>
            Sign in
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-paper/70">
          New here?{' '}
          <Link href={AUTH_ROUTES.register} className="text-accent hover:underline">
            Create account
          </Link>
        </p>
      </AuthCard>
    </PublicOnly>
  );
}
