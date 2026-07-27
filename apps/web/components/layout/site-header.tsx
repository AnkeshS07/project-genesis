'use client';

import Link from 'next/link';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/features/auth/use-auth';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/auth/constants';

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { status } = useAuth();

  return (
    <header className="border-b border-ink/10 bg-paper/80 backdrop-blur dark:border-paper/10 dark:bg-ink/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="block">
          <p className="font-display text-xl tracking-tight">Project Genesis</p>
          <p className="text-sm text-ink-muted dark:text-paper/70">Creative operating platform</p>
        </Link>

        <div className="flex items-center gap-3">
          {status === 'authenticated' ? (
            <Link
              href={PROTECTED_ROUTES.account}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm transition hover:bg-accent-soft dark:border-paper/20 dark:hover:bg-paper/10"
            >
              Account
            </Link>
          ) : (
            <Link
              href={AUTH_ROUTES.login}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm transition hover:bg-accent-soft dark:border-paper/20 dark:hover:bg-paper/10"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-ink/15 px-3 py-1.5 text-sm transition hover:bg-accent-soft dark:border-paper/20 dark:hover:bg-paper/10"
          >
            Theme: {theme}
          </button>
        </div>
      </div>
    </header>
  );
}
