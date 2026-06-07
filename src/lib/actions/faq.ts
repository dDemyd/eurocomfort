'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bool, getAdminSupabase, num, readLocalized } from './_helpers';

const PATH = '/admin/faq';

export async function saveFaqAction(id: string | null, fd: FormData) {
  const supabase = await getAdminSupabase();
  const payload = {
    question: readLocalized(fd, 'question'),
    answer: readLocalized(fd, 'answer'),
    sort: num(fd, 'sort', 0),
    is_published: bool(fd, 'is_published'),
  };

  if (id) {
    const { error } = await supabase.from('faq').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('faq').insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath(PATH);
  revalidatePath('/uk');
  revalidatePath('/ru');
  redirect(PATH);
}

export async function deleteFaqAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}

export async function togglePublishFaqAction(id: string, next: boolean) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('faq')
    .update({ is_published: next })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(PATH);
}
