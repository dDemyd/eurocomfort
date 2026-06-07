import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { fontVariables } from '@/app/fonts';

export const metadata = {
  title: 'Вхід · Адмін · ЄВРО КОМФОРТ',
  robots: { index: false, follow: false },
};

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning className={fontVariables}>
      <body className="bg-ash text-ink">{children}</body>
    </html>
  );
}
