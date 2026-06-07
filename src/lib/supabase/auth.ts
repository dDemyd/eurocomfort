import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from './server';

export type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'viewer';
};

/**
 * Возвращает текущего пользователя + его профиль, если он admin.
 * null — если нет сессии или роль не admin.
 */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') return null;

  return {
    id: profile.id,
    email: user.email ?? null,
    full_name: (profile.full_name as string | null) ?? null,
    role: profile.role as 'admin',
  };
}

/** Жёсткий guard для серверных компонентов и actions. */
export async function requireAdmin(): Promise<AdminProfile> {
  const me = await getCurrentAdmin();
  if (!me) redirect('/admin/login');
  return me;
}
