'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bool, getAdminSupabase, num, readLocalized, str } from './_helpers';

const PATH = '/admin/testimonials';

export async function saveTestimonialAction(id: string | null, fd: FormData) {
  const supabase = await getAdminSupabase();
  const payload = {
    author: str(fd, 'author', 200) ?? '',
    body: readLocalized(fd, 'body'),
    sort: num(fd, 'sort', 0),
    is_published: bool(fd, 'is_published'),
  };
  if (!payload.author) throw new Error('author required');

  if (id) {
    const { error } = await supabase
      .from('testimonials')
      .update(payload)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('testimonials').insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath(PATH);
  revalidatePath('/uk');
  revalidatePath('/ru');
  redirect(PATH);
}

export async function deleteTestimonialAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}

export async function togglePublishTestimonialAction(id: string, next: boolean) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('testimonials')
    .update({ is_published: next })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}
