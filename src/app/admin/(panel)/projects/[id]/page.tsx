import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import ProjectForm from '../ProjectForm';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: row }, { data: categories }] = await Promise.all([
    supabase
      .from('projects')
      .select(
        'id, slug, title, location, system, description, category_id, cover, images, sort, is_published'
      )
      .eq('id', id)
      .maybeSingle(),
    supabase.from('categories').select('id, title').order('sort'),
  ]);
  if (!row) notFound();
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Проєкт
      </h1>
      <ProjectForm
        row={row as never}
        categories={(categories ?? []) as never}
      />
    </div>
  );
}
