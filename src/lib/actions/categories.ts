'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  bool,
  getAdminSupabase,
  num,
  readLocalized,
  str,
} from './_helpers';
import {
  revalidateCatalogPage,
  revalidatePublicPages,
} from './revalidation';
import { CategoryContentSchema } from '@/lib/categoryContent';

const PATH = '/admin/categories';

export async function saveCategoryAction(id: string | null, fd: FormData) {
  const supabase = await getAdminSupabase();
  const previous = id
    ? await supabase
        .from('categories')
        .select('slug')
        .eq('id', id)
        .maybeSingle()
    : null;
  const payload = {
    slug: str(fd, 'slug', 80),
    title: readLocalized(fd, 'title'),
    image: str(fd, 'image', 500),
    sort: num(fd, 'sort', 0),
    is_published: bool(fd, 'is_published'),
  };
  if (!payload.slug) throw new Error('slug required');

  if (id) {
    const { error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('categories').insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath(PATH);
  revalidatePublicPages();
  revalidateCatalogPage(payload.slug);
  if (previous?.data?.slug && previous.data.slug !== payload.slug) {
    revalidateCatalogPage(previous.data.slug);
  }
  redirect(PATH);
}

export type ContentFormState = { error: string | null };

/**
 * Зберігає block-based контент сторінки категорії (jsonb) із JSON-редактора.
 * Сумісний з `useActionState`: повертає { error } для показу інлайн; при успіху
 * валідує проти CategoryContentSchema, оновлює рядок, ревалідує сторінки й
 * редіректить на список. `id` та `slug` беруться з прихованих полів форми.
 */
export async function saveCategoryContentState(
  _prev: ContentFormState,
  fd: FormData
): Promise<ContentFormState> {
  const id = String(fd.get('id') ?? '');
  const slug = String(fd.get('slug') ?? '');
  if (!id || !slug) return { error: 'Відсутній id або slug категорії.' };

  const raw = String(fd.get('content') ?? '').trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: 'Невалідний JSON: перевірте синтаксис.' };
  }

  const result = CategoryContentSchema.safeParse(parsed);
  if (!result.success) {
    const details = result.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join('.') || '(корінь)'}: ${i.message}`)
      .join('; ');
    return { error: `Не відповідає схемі — ${details}` };
  }
  if (result.data.slug !== slug) {
    return {
      error: `Поле slug у контенті ("${result.data.slug}") не збігається з категорією ("${slug}").`,
    };
  }

  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('categories')
    .update({ content: result.data })
    .eq('id', id);
  if (error) return { error: error.message };

  revalidatePath(PATH);
  revalidateCatalogPage(slug);
  redirect(PATH);
}

export async function deleteCategoryAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
  revalidatePublicPages();
}

export async function togglePublishCategoryAction(id: string, next: boolean) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('categories')
    .update({ is_published: next })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
  revalidatePublicPages();
}
