'use client';

import { AuthButton } from '@/components/auth/auth-button';
import { useAuth } from '@/features/auth/use-auth';

export default function AccountPage() {
  const { user, logout, refreshSession } = useAuth();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Epic 01 · Authentication</p>
        <h1 className="font-display text-4xl leading-tight">Signed in</h1>
        <p className="max-w-2xl text-lg text-ink-muted dark:text-paper/75">
          This protected route confirms session restore, access tokens, and logout. Dashboard and
          workspace surfaces are out of scope for M4.
        </p>
      </div>

      <dl className="grid gap-4 rounded-xl border border-ink/10 bg-paper-deep/60 p-6 dark:border-paper/15 dark:bg-ink/40 md:grid-cols-2">
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">Name</dt>
          <dd className="mt-1 text-sm">{user?.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">Email</dt>
          <dd className="mt-1 text-sm">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">Role</dt>
          <dd className="mt-1 text-sm">{user?.role}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">Status</dt>
          <dd className="mt-1 text-sm">{user?.status}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <AuthButton type="button" className="w-auto px-5" onClick={() => void refreshSession()}>
          Refresh session
        </AuthButton>
        <AuthButton type="button" className="w-auto px-5" onClick={() => void logout()}>
          Sign out
        </AuthButton>
      </div>
    </section>
  );
}
