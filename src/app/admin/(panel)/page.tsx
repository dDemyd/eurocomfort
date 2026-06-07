import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const tiles = [
  { href: '/admin/leads', label: 'Заявки', table: 'leads' as const },
  { href: '/admin/projects', label: 'Проєкти', table: 'projects' as const },
  { href: '/admin/categories', label: 'Категорії', table: 'categories' as const },
  { href: '/admin/testimonials', label: 'Відгуки', table: 'testimonials' as const },
  { href: '/admin/faq', label: 'FAQ', table: 'faq' as const },
  { href: '/admin/content', label: 'Контент', table: 'content_blocks' as const },
  { href: '/admin/settings', label: 'Налаштування', table: 'settings' as const },
];

async function counts() {
  const supabase = createAdminClient();
  const res = await Promise.all(
    tiles.map(async (t) => {
      const { count } = await supabase
        .from(t.table)
        .select('*', { count: 'exact', head: true });
      return [t.table, count ?? 0] as const;
    })
  );
  return Object.fromEntries(res) as Record<(typeof tiles)[number]['table'], number>;
}

export default async function DashboardPage() {
  const c = await counts().catch(() => ({}) as Record<string, number>);

  return (
    <div>
      <h1 className="mb-6 font-display text-[28px] font-extrabold uppercase tracking-tight2">
        Дашборд
      </h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group block border border-hair-l bg-paper p-5 transition-colors hover:border-ink"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2">
              {tile.table}
            </div>
            <div className="mt-2 font-display text-[22px] font-bold uppercase tracking-tight2">
              {tile.label}
            </div>
            <div className="mt-4 font-mono text-[24px] font-bold tabular-nums">
              {c[tile.table] ?? 0}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
