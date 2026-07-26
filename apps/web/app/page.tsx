import { APP_NAME } from '@project-genesis/shared';
import { getApiBaseUrl } from '@/lib/api-client';

export default function HomePage() {
  const apiBaseUrl = getApiBaseUrl();

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Epic 00 · Bootstrap</p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          {APP_NAME} UI shell is online
        </h1>
        <p className="max-w-2xl text-lg text-ink-muted dark:text-paper/75">
          This Next.js App Router app is UI-only. Business REST APIs are served by NestJS — not by
          Next.js Route Handlers.
        </p>
      </div>

      <dl className="grid gap-4 rounded-xl border border-ink/10 bg-paper-deep/60 p-6 dark:border-paper/15 dark:bg-ink/40 md:grid-cols-2">
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">NestJS API base URL</dt>
          <dd className="mt-1 font-mono text-sm">{apiBaseUrl}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted dark:text-paper/60">Business app/api routes</dt>
          <dd className="mt-1 text-sm">None (Architecture 1.1)</dd>
        </div>
      </dl>
    </section>
  );
}
