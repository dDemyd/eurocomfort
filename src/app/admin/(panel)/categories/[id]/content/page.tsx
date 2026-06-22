import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { categoryContentSeed } from '@/content/categories';
import ContentForm from './ContentForm';

export const dynamic = 'force-dynamic';

function hasContent(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && Object.keys(value).length > 0;
}

export default async function EditCategoryContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from('categories')
    .select('id, slug, title, content')
    .eq('id', id)
    .maybeSingle();
  if (!row) notFound();

  const fromDb = hasContent(row.content);
  const source = fromDb ? row.content : categoryContentSeed[row.slug] ?? {};
  const initialContent = JSON.stringify(source, null, 2);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 font-mono text-[12px] text-ink-2">
        <Link href="/admin/categories" className="hover:text-ink">
          Категорії
        </Link>
        <span>/</span>
        <Link href={`/admin/categories/${id}`} className="hover:text-ink">
          {row.slug}
        </Link>
        <span>/</span>
        <span>контент</span>
      </div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Контент сторінки — {(row.title as Record<string, string>)?.uk ?? row.slug}
      </h1>

      <ContentForm
        id={row.id}
        slug={row.slug}
        initialContent={initialContent}
        usingFallback={!fromDb}
      />
    </div>
  );
}
