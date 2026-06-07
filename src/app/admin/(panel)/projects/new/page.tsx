import { createAdminClient } from '@/lib/supabase/admin';
import ProjectForm from '../ProjectForm';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('id, title')
    .order('sort');
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Новий проєкт
      </h1>
      <ProjectForm categories={(categories ?? []) as never} />
    </div>
  );
}
