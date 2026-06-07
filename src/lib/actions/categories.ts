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

const PATH = '/admin/categories';

export async function saveCategoryAction(id: string | null, fd: FormData) {
  const supabase = await getAdminSupabase();
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
  revalidatePath('/uk');
  revalidatePath('/ru');
  redirect(PATH);
}

export async function deleteCategoryAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}

export async function togglePublishCategoryAction(id: string, next: boolean) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('categories')
    .update({ is_published: next })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}
