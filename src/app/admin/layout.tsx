import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { fontVariables } from '@/app/fonts';

// TODO: серверный guard — проверка сессии и role==='admin' через
// @/lib/supabase/server + profiles. Сейчас заглушка для сборки.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning className={fontVariables}>
      <body>
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b">
            <div className="container mx-auto flex h-14 items-center text-sm font-medium">
              Admin
            </div>
          </header>
          <div className="container mx-auto py-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
