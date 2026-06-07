'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSupabase, readLocalized } from './_helpers';

/**
 * Сохранение пачки content_blocks из одной формы:
 *   <input name="keys" type="hidden" value="hero.title">
 *   <input name="hero.title_uk" value="...">
 *   <input name="hero.title_ru" value="...">
 * Можно несколько `keys` — обрабатываем все.
 */
export async function saveContentAction(fd: FormData) {
  const supabase = await getAdminSupabase();
  const keys = fd.getAll('keys').map(String).filter(Boolean);
  if (keys.length === 0) return;

  const rows = keys.map((key) => ({
    key,
    value: readLocalized(fd, key),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('content_blocks')
    .upsert(rows, { onConflict: 'key' });
  if (error) throw new Error(error.message);

  revalidatePath('/admin/content');
  revalidatePath('/uk');
  revalidatePath('/ru');
}

export async function saveContentBlockAction(key: string, fd: FormData) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('content_blocks')
    .upsert({ key, value: readLocalized(fd, key), updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content');
  revalidatePath('/uk');
  revalidatePath('/ru');
}
