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
import { revalidatePublicPages } from './revalidation';

const PATH = '/admin/projects';

export async function saveProjectAction(id: string | null, fd: FormData) {
  const supabase = await getAdminSupabase();

  const images = fd
    .getAll('images')
    .map(String)
    .filter((s) => s.trim().length > 0);

  const payload = {
    slug: str(fd, 'slug', 120),
    title: readLocalized(fd, 'title'),
    location: readLocalized(fd, 'location'),
    system: readLocalized(fd, 'system'),
    description: readLocalized(fd, 'description'),
    category_id: str(fd, 'category_id', 100),
    cover: str(fd, 'cover', 500),
    images,
    sort: num(fd, 'sort', 0),
    is_published: bool(fd, 'is_published'),
  };

  if (id) {
    const { error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('projects').insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath(PATH);
  revalidatePublicPages();
  redirect(PATH);
}

export async function deleteProjectAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
  revalidatePublicPages();
}

export async function togglePublishProjectAction(id: string, next: boolean) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('projects')
    .update({ is_published: next })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
  revalidatePublicPages();
}
