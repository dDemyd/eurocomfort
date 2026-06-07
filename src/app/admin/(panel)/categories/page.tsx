import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Button, Table, Td, Th } from '@/components/admin/ui';
import {
  deleteCategoryAction,
  togglePublishCategoryAction,
} from '@/lib/actions/categories';
import { PublishToggle, DeleteButton } from '@/components/admin/RowActions';

export const dynamic = 'force-dynamic';

type Row = {
  id: string;
  slug: string;
  title: Record<string, string>;
  image: string | null;
  sort: number;
  is_published: boolean;
};

export default async function CategoriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('categories')
    .select('id, slug, title, image, sort, is_published')
    .order('sort', { ascending: true });

  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[28px] font-extrabold uppercase tracking-tight2">
          Категорії <span className="text-ink-2 text-[18px]">({rows.length})</span>
        </h1>
        <Link href="/admin/categories/new">
          <Button>+ Створити</Button>
        </Link>
      </div>

      <Table>
        <thead>
          <tr>
            <Th className="w-[60px]">#</Th>
            <Th>Slug</Th>
            <Th>Заголовок (uk)</Th>
            <Th className="w-[100px]">Sort</Th>
            <Th className="w-[100px]">Public</Th>
            <Th className="w-[180px] text-right">Дії</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <Td className="text-center text-ink-2">Поки немає категорій.</Td>
              <Td /><Td /><Td /><Td /><Td />
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id}>
                <Td className="font-mono text-ink-2">{i + 1}</Td>
                <Td className="font-mono">{r.slug}</Td>
                <Td>{r.title?.uk ?? '—'}</Td>
                <Td className="font-mono tabular-nums">{r.sort}</Td>
                <Td>
                  <PublishToggle
                    isPublished={r.is_published}
                    onToggle={async (next) => {
                      'use server';
                      await togglePublishCategoryAction(r.id, next);
                    }}
                  />
                </Td>
                <Td className="text-right">
                  <Link href={`/admin/categories/${r.id}`}>
                    <Button variant="outline" size="sm">
                      Редагувати
                    </Button>
                  </Link>{' '}
                  <DeleteButton
                    onDelete={async () => {
                      'use server';
                      await deleteCategoryAction(r.id);
                    }}
                  />
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
