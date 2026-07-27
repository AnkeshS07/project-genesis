import type { ReactNode } from 'react';
import { RequireAuth } from '@/components/auth/require-auth';
import { SiteHeader } from '@/components/layout/site-header';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <RequireAuth>{children}</RequireAuth>
      </main>
    </div>
  );
}
