import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import FaqForm from '../FaqForm';

export const dynamic = 'force-dynamic';

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from('faq')
    .select('id, question, answer, sort, is_published')
    .eq('id', id)
    .maybeSingle();
  if (!row) notFound();
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        FAQ
      </h1>
      <FaqForm row={row as never} />
    </div>
  );
}
