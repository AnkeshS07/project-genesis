import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/app-providers';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Genesis',
  description: 'AI-first creative operating platform — UI shell',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
