import type { Locale } from '@/i18n/routing';
import { createClient } from './supabase/server';

type LocalizedJson = Record<string, unknown> | null;

export type Category = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  sort: number;
};

export type Project = {
  id: string;
  slug: string | null;
  title: string;
  location: string;
  system: string;
  description: string;
  categoryId: string | null;
  cover: string | null;
  images: string[];
  sort: number;
};

export type Testimonial = {
  id: string;
  author: string;
  body: string;
  sort: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort: number;
};

export type LocalizedRecord = Record<string, string>;

function unwrap(value: LocalizedJson, locale: Locale): string {
  if (!value || typeof value !== 'object') return '';
  const localized = value[locale];
  const fallback = value.uk;
  return String(localized || fallback || '');
}

function getPublicMediaUrl(path: string | null | undefined, supabase: Awaited<ReturnType<typeof createClient>>) {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

async function safeQuery<T>(fallback: T, query: () => Promise<T>) {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  return safeQuery([], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, title, image, sort')
      .eq('is_published', true)
      .order('sort');

    if (error) return [];

    return (data ?? []).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: unwrap(item.title as LocalizedJson, locale),
      image: getPublicMediaUrl(item.image, supabase),
      sort: item.sort,
    }));
  });
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  return safeQuery([], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('id, slug, title, location, system, description, category_id, cover, images, sort')
      .eq('is_published', true)
      .order('sort');

    if (error) return [];

    return (data ?? []).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: unwrap(item.title as LocalizedJson, locale),
      location: unwrap(item.location as LocalizedJson, locale),
      system: unwrap(item.system as LocalizedJson, locale),
      description: unwrap(item.description as LocalizedJson, locale),
      categoryId: item.category_id,
      cover: getPublicMediaUrl(item.cover, supabase),
      images: ((item.images ?? []) as string[]).map((image: string) => getPublicMediaUrl(image, supabase)).filter(Boolean) as string[],
      sort: item.sort,
    }));
  });
}

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  return safeQuery([], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, author, body, sort')
      .eq('is_published', true)
      .order('sort');

    if (error) return [];

    return (data ?? []).map((item) => ({
      id: item.id,
      author: item.author,
      body: unwrap(item.body as LocalizedJson, locale),
      sort: item.sort,
    }));
  });
}

export async function getFaq(locale: Locale): Promise<FaqItem[]> {
  return safeQuery([], async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('faq')
      .select('id, question, answer, sort')
      .eq('is_published', true)
      .order('sort');

    if (error) return [];

    return (data ?? []).map((item) => ({
      id: item.id,
      question: unwrap(item.question as LocalizedJson, locale),
      answer: unwrap(item.answer as LocalizedJson, locale),
      sort: item.sort,
    }));
  });
}

export async function getContentBlocks(locale: Locale): Promise<LocalizedRecord> {
  return safeQuery({}, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_blocks')
      .select('key, value');

    if (error) return {};

    return Object.fromEntries(
      (data ?? []).map((item) => [item.key, unwrap(item.value as LocalizedJson, locale)])
    );
  });
}

export async function getSettings(locale: Locale): Promise<LocalizedRecord> {
  return safeQuery({}, async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('key, value');

    if (error) return {};

    return Object.fromEntries(
      (data ?? []).map((item) => [item.key, unwrap(item.value as LocalizedJson, locale)])
    );
  });
}

export async function getLandingData(locale: Locale) {
  const [categories, projects, testimonials, faq, content, settings] = await Promise.all([
    getCategories(locale),
    getProjects(locale),
    getTestimonials(locale),
    getFaq(locale),
    getContentBlocks(locale),
    getSettings(locale),
  ]);

  return { categories, projects, testimonials, faq, content, settings };
}

export async function getCategoryData(locale: Locale, slug: string) {
  const [categories, projects, content, settings] = await Promise.all([
    getCategories(locale),
    getProjects(locale),
    getContentBlocks(locale),
    getSettings(locale),
  ]);
  const category = categories.find((item) => item.slug === slug) ?? null;
  const categoryProjects = category
    ? projects.filter((project) => project.categoryId === category.id)
    : [];

  return { categories, category, projects: categoryProjects, content, settings };
}
