import Link from 'next/link';
import Image from 'next/image';
import { createAdminClient } from '@/lib/supabase/admin';
import { Button, Table, Td, Th } from '@/components/admin/ui';
import {
  deleteProjectAction,
  togglePublishProjectAction,
} from '@/lib/actions/projects';
import { PublishToggle, DeleteButton } from '@/components/admin/RowActions';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  title: Record<string, string>;
  cover: string | null;
  sort: number;
  is_published: boolean;
};

export default async function ProjectsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('projects')
    .select('id, title, cover, sort, is_published')
    .order('sort');
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-extrabold uppercase tracking-tight2">
          Проєкти <span className="text-ink-2 text-[18px]">({rows.length})</span>
        </h1>
        <Link href="/admin/projects/new">
          <Button>+ Створити</Button>
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <Th className="w-[60px]">#</Th>
            <Th className="w-[88px]">Обкл.</Th>
            <Th>Назва (uk)</Th>
            <Th className="w-[80px]">Sort</Th>
            <Th className="w-[100px]">Public</Th>
            <Th className="w-[180px] text-right">Дії</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <Td className="font-mono text-ink-2">{i + 1}</Td>
              <Td>
                {r.cover ? (
                  <div className="relative h-[44px] w-[64px] overflow-hidden border border-hair-l">
                    <Image
                      src={r.cover}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="text-ink-2">—</span>
                )}
              </Td>
              <Td>{r.title?.uk ?? '—'}</Td>
              <Td className="font-mono tabular-nums">{r.sort}</Td>
              <Td>
                <PublishToggle
                  isPublished={r.is_published}
                  onToggle={async (next) => {
                    'use server';
                    await togglePublishProjectAction(r.id, next);
                  }}
                />
              </Td>
              <Td className="text-right">
                <Link href={`/admin/projects/${r.id}`}>
                  <Button variant="outline" size="sm">Редагувати</Button>
                </Link>{' '}
                <DeleteButton
                  onDelete={async () => {
                    'use server';
                    await deleteProjectAction(r.id);
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
