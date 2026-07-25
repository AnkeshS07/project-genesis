import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="text-ink-muted dark:text-paper/70">
        This UI shell only includes the home route for now.
      </p>
      <Link
        href="/"
        className="inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Back home
      </Link>
    </div>
  );
}
