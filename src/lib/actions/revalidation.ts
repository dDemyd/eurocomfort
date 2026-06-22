import 'server-only';
import { revalidatePath } from 'next/cache';
import { catalogPages } from '@/lib/catalogPages';

export function revalidateLandingPages() {
  revalidatePath('/');
  revalidatePath('/uk');
  revalidatePath('/ru');
}

export function revalidateCatalogPage(slug: string) {
  revalidatePath(`/catalog/${slug}`);
  revalidatePath(`/uk/catalog/${slug}`);
  revalidatePath(`/ru/catalog/${slug}`);
}

export function revalidateAllCatalogPages() {
  for (const page of catalogPages) {
    revalidateCatalogPage(page.slug);
  }
}

export function revalidatePublicPages() {
  revalidateLandingPages();
  revalidateAllCatalogPages();
}
