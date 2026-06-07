'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSupabase } from './_helpers';

const BUCKET = 'media';

function safeName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

/**
 * Заливает файл в bucket 'media' и возвращает публичный URL.
 * Принимает FormData с полем `file`.
 */
export async function uploadMediaAction(
  fd: FormData
): Promise<{ ok: true; url: string; path: string } | { ok: false; error: string }> {
  const file = fd.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'no_file' };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: 'too_large' };
  }
  if (!/^image\//.test(file.type)) {
    return { ok: false, error: 'bad_type' };
  }

  const supabase = await getAdminSupabase();
  const ext = file.name.includes('.')
    ? file.name.split('.').pop()!.toLowerCase()
    : 'bin';
  const path = `projects/${Date.now()}-${safeName(
    file.name.replace(/\.[^.]+$/, '')
  )}.${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  revalidatePath('/admin/projects');
  return { ok: true, url: pub.publicUrl, path };
}

export async function deleteMediaAction(path: string) {
  if (!path || path.startsWith('http')) return;
  const supabase = await getAdminSupabase();
  await supabase.storage.from(BUCKET).remove([path]);
}
