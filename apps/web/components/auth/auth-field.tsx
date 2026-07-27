import type { InputHTMLAttributes } from 'react';

export function AuthField({
  label,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={fieldId}
        className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-paper/20 dark:bg-ink/40"
        {...props}
      />
      {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
