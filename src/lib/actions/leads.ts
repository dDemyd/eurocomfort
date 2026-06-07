'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSupabase } from './_helpers';

export type LeadStatus = 'new' | 'in_progress' | 'done';

export async function setLeadStatusAction(id: string, status: LeadStatus) {
  if (!['new', 'in_progress', 'done'].includes(status)) {
    throw new Error('invalid_status');
  }
  const supabase = await getAdminSupabase();
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}

export async function deleteLeadAction(id: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}
