import Link from 'next/link';
import { APP_NAME } from '@project-genesis/shared';

export function AuthBrand() {
  return (
    <div className="space-y-2 text-center">
      <Link href="/" className="inline-block font-display text-2xl tracking-tight text-ink dark:text-paper">
        {APP_NAME}
      </Link>
    </div>
  );
}
