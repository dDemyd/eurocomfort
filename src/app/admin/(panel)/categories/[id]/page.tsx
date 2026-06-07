import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import CategoryForm from '../CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from('categories')
    .select('id, slug, title, image, sort, is_published')
    .eq('id', id)
    .maybeSingle();
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Категорія
      </h1>
      <CategoryForm row={row as never} />
    </div>
  );
}
