'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAlert, AuthSuccess } from '@/components/auth/auth-alert';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthCard } from '@/components/auth/auth-card';
import { AuthField } from '@/components/auth/auth-field';
import { PublicOnly } from '@/components/auth/public-only';
import { mapAuthError } from '@/features/auth/map-auth-error';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/validations';
import { createApiClient } from '@/lib/api-client';
import { AUTH_ROUTES } from '@/lib/auth/constants';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-ink-muted dark:text-paper/70">Loading reset form…</div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordPageContent() {
  const apiClient = createApiClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      password: '',
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token, { shouldValidate: true });
    }
  }, [searchParams, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.auth.resetPassword({
        token: values.token,
        password: values.password,
      });
      setSuccessMessage(response.message || 'Your password has been reset.');
      setTimeout(() => {
        router.push(AUTH_ROUTES.login);
      }, 1200);
    } catch (error) {
      setFormError(mapAuthError(error, 'Unable to reset your password.'));
    }
  });

  return (
    <PublicOnly>
      <AuthCard
        title="Create a new password"
        description="Choose a strong password you have not used here before."
      >
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {formError ? <AuthAlert message={formError} /> : null}
          {successMessage ? <AuthSuccess message={successMessage} /> : null}

          <AuthField
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <p className="text-sm text-ink-muted dark:text-paper/70">
            Use at least 8 characters with a mix you will remember.
          </p>

          <AuthButton type="submit" loading={isSubmitting}>
            Reset password
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-paper/70">
          <Link href={AUTH_ROUTES.login} className="text-accent hover:underline">
            Return to sign in
          </Link>
        </p>
      </AuthCard>
    </PublicOnly>
  );
}
