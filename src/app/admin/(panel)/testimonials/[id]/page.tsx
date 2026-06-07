import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import TestimonialForm from '../TestimonialForm';

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from('testimonials')
    .select('id, author, body, sort, is_published')
    .eq('id', id)
    .maybeSingle();
  if (!row) notFound();
  return (
    <div>
      <h1 className="mb-6 font-display text-[24px] font-extrabold uppercase tracking-tight2">
        Відгук
      </h1>
      <TestimonialForm row={row as never} />
    </div>
  );
}
