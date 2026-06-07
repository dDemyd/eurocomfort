import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Button, Table, Td, Th } from '@/components/admin/ui';
import {
  deleteTestimonialAction,
  togglePublishTestimonialAction,
} from '@/lib/actions/testimonials';
import { PublishToggle, DeleteButton } from '@/components/admin/RowActions';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  author: string;
  body: Record<string, string>;
  sort: number;
  is_published: boolean;
};

export default async function TestimonialsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('testimonials')
    .select('id, author, body, sort, is_published')
    .order('sort', { ascending: true });
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-extrabold uppercase tracking-tight2">
          Відгуки <span className="text-ink-2 text-[18px]">({rows.length})</span>
        </h1>
        <Link href="/admin/testimonials/new">
          <Button>+ Створити</Button>
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <Th className="w-[60px]">#</Th>
            <Th>Автор</Th>
            <Th>Текст (uk)</Th>
            <Th className="w-[80px]">Sort</Th>
            <Th className="w-[100px]">Public</Th>
            <Th className="w-[180px] text-right">Дії</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <Td className="font-mono text-ink-2">{i + 1}</Td>
              <Td>{r.author}</Td>
              <Td className="max-w-[420px] truncate text-ink-2">
                {(r.body?.uk ?? '').slice(0, 120)}
              </Td>
              <Td className="font-mono tabular-nums">{r.sort}</Td>
              <Td>
                <PublishToggle
                  isPublished={r.is_published}
                  onToggle={async (next) => {
                    'use server';
                    await togglePublishTestimonialAction(r.id, next);
                  }}
                />
              </Td>
              <Td className="text-right">
                <Link href={`/admin/testimonials/${r.id}`}>
                  <Button variant="outline" size="sm">Редагувати</Button>
                </Link>{' '}
                <DeleteButton
                  onDelete={async () => {
                    'use server';
                    await deleteTestimonialAction(r.id);
                  }}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
