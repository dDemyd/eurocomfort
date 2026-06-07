import type { Locale } from '@/i18n/routing';
import { createClient } from './supabase/server';

export async function getCategories(_locale: Locale) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_published', true)
    .order('sort');
  return data ?? [];
}

export async function getProjects(_locale: Locale) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort');
  return data ?? [];
}
