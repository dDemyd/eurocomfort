import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { fontVariables } from '@/app/fonts';
import { requireAdmin } from '@/lib/supabase/auth';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Адмін · ЄВРО КОМФОРТ',
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const me = await requireAdmin();
  return (
    <html lang="uk" suppressHydrationWarning className={fontVariables}>
      <body className="bg-ash text-ink">
        <AdminShell email={me.email}>{children}</AdminShell>
      </body>
    </html>
  );
}
