'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-ink-muted dark:text-paper/70">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-accent px-4 py-2 text-sm text-paper transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
