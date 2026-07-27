import type { ButtonHTMLAttributes } from 'react';

export function AuthButton({
  children,
  loading = false,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type={props.type ?? 'button'}
      disabled={loading || props.disabled}
      className={`inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
