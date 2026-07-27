'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAlert, AuthSuccess } from '@/components/auth/auth-alert';
import { AuthButton } from '@/components/auth/auth-button';
import { AuthCard } from '@/components/auth/auth-card';
import { AuthField } from '@/components/auth/auth-field';
import { PublicOnly } from '@/components/auth/public-only';
import { mapAuthError } from '@/features/auth/map-auth-error';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/validations';
import { createApiClient } from '@/lib/api-client';
import { AUTH_ROUTES } from '@/lib/auth/constants';

export default function ForgotPasswordPage() {
  const apiClient = createApiClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.auth.forgotPassword({ email: values.email });
      setSuccessMessage(
        response.message ||
          'If an account exists for that email, a reset link has been sent.',
      );
    } catch (error) {
      setFormError(mapAuthError(error, 'Unable to send reset email.'));
    }
  });

  return (
    <PublicOnly>
      <AuthCard
        title="Reset your password"
        description="Enter your account email and we will send reset instructions."
      >
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {formError ? <AuthAlert message={formError} /> : null}
          {successMessage ? <AuthSuccess message={successMessage} /> : null}

          <AuthField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <AuthButton type="submit" loading={isSubmitting}>
            Send reset link
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-paper/70">
          <Link href={AUTH_ROUTES.login} className="text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthCard>
    </PublicOnly>
  );
}
