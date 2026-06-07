import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const me = await getCurrentAdmin();
  if (me) redirect('/admin');
  return (
    <div className="flex min-h-screen items-center justify-center bg-ash p-6">
      <div className="w-full max-w-[400px] border border-hair-l bg-paper p-8">
        <h1 className="font-display text-[28px] font-extrabold uppercase tracking-tight2 text-ink">
          ЄВРО КОМФОРТ
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2">
          Адмін-панель
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
