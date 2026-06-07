import 'server-only';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export type Localized = { uk: string; ru: string };

/** Берём из FormData пару key_uk + key_ru → { uk, ru } */
export function readLocalized(fd: FormData, key: string): Localized {
  return {
    uk: String(fd.get(`${key}_uk`) ?? '').trim(),
    ru: String(fd.get(`${key}_ru`) ?? '').trim(),
  };
}

export function str(fd: FormData, key: string, max = 500): string | null {
  const v = String(fd.get(key) ?? '').trim();
  if (!v) return null;
  return v.slice(0, max);
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === 'on' || v === 'true' || v === '1';
}

export function num(fd: FormData, key: string, fallback = 0): number {
  const v = Number(fd.get(key));
  return Number.isFinite(v) ? v : fallback;
}

/** Проверка роли + возврат admin-клиента (RLS обходит). */
export async function getAdminSupabase() {
  await requireAdmin();
  return createAdminClient();
}
