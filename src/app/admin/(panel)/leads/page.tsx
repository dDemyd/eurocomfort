import { createAdminClient } from '@/lib/supabase/admin';
import LeadsClient, { type Lead } from './LeadsClient';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('leads')
    .select('id, name, phone, comment, locale, page, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="mb-6 font-display text-[28px] font-extrabold uppercase tracking-tight2">
        Заявки
      </h1>
      <LeadsClient initial={(data ?? []) as Lead[]} />
    </div>
  );
}
