import Link from 'next/link';
import { APP_NAME } from '@project-genesis/shared';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/auth/constants';

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Epic 01 · M4 Frontend</p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          {APP_NAME} authentication is ready
        </h1>
        <p className="max-w-2xl text-lg text-ink-muted dark:text-paper/75">
          Sign in, register, recover access, and restore sessions against the NestJS auth API. This
          shell keeps business logic on the server and uses the shared SDK for HTTP integration.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={AUTH_ROUTES.login}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
        >
          Sign in
        </Link>
        <Link
          href={AUTH_ROUTES.register}
          className="rounded-lg border border-ink/15 px-4 py-2 text-sm transition hover:bg-accent-soft dark:border-paper/20"
        >
          Create account
        </Link>
        <Link
          href={PROTECTED_ROUTES.account}
          className="rounded-lg border border-ink/15 px-4 py-2 text-sm transition hover:bg-accent-soft dark:border-paper/20"
        >
          Account (protected)
        </Link>
      </div>
    </section>
  );
}
