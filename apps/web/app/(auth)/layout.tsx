import type { ReactNode } from 'react';
import { AuthBrand } from '@/components/auth/auth-brand';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-paper via-paper-deep/60 to-paper px-6 py-12 dark:from-ink dark:via-ink dark:to-ink/90">
      <div className="mb-8">
        <AuthBrand />
      </div>
      {children}
    </div>
  );
}
