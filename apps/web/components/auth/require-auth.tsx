'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-sm text-ink-muted dark:text-paper/70">
        Restoring your session…
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return children;
}
