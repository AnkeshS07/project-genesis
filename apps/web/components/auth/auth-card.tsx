import type { ReactNode } from 'react';

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper/90 p-8 shadow-sm backdrop-blur dark:border-paper/15 dark:bg-ink/70">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-ink-muted dark:text-paper/70">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
