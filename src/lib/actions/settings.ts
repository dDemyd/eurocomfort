'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSupabase } from './_helpers';

/**
 * Глобальные настройки сайта: телефон, email, адрес, соцсети — плоские
 * key/value пары. Значение можно хранить как { value: "..." } или просто строку.
 * Здесь упрощённо — единая строка → { v: string } в jsonb.
 *
 * Форма содержит набор полей name=`set:key`, value=строка.
 */
export async function saveSettingsAction(fd: FormData) {
  const supabase = await getAdminSupabase();
  const rows: { key: string; value: { v: string }; updated_at: string }[] = [];

  for (const [name, raw] of fd.entries()) {
    if (!name.startsWith('set:')) continue;
    const key = name.slice('set:'.length);
    if (!key) continue;
    rows.push({
      key,
      value: { v: String(raw).slice(0, 2000) },
      updated_at: new Date().toISOString(),
    });
  }
  if (rows.length === 0) return;

  const { error } = await supabase
    .from('settings')
    .upsert(rows, { onConflict: 'key' });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/settings');
  revalidatePath('/uk');
  revalidatePath('/ru');
}
