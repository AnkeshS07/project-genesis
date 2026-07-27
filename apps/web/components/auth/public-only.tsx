'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PROTECTED_ROUTES } from '@/lib/auth/constants';
import { useAuth } from '@/features/auth/use-auth';

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(PROTECTED_ROUTES.account);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-muted dark:text-paper/70">
        Checking session…
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return children;
}
