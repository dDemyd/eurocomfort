'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOutAction } from '@/lib/actions/auth';

const nav = [
  { href: '/admin', label: 'Дашборд', exact: true },
  { href: '/admin/leads', label: 'Заявки' },
  { href: '/admin/projects', label: 'Проєкти' },
  { href: '/admin/categories', label: 'Категорії' },
  { href: '/admin/testimonials', label: 'Відгуки' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/content', label: 'Контент' },
  { href: '/admin/settings', label: 'Налаштування' },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (item: (typeof nav)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-ash text-ink">
      <header className="sticky top-0 z-40 border-b border-hair-l bg-paper">
        <div className="flex h-14 items-center gap-6 px-6">
          <Link
            href="/admin"
            className="font-display text-[15px] font-extrabold uppercase tracking-tight2"
          >
            ЄВРО КОМФОРТ <span className="text-brand">·</span>{' '}
            <span className="font-mono text-[11px] tracking-[0.18em] text-ink-2">
              admin
            </span>
          </Link>
          <span className="ml-auto truncate font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
            {email}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="h-8 border border-hair-l px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink hover:bg-ash"
            >
              Вийти
            </button>
          </form>
        </div>
      </header>
      <div className="grid grid-cols-[220px_1fr] gap-0">
        <nav className="min-h-[calc(100vh-56px)] border-r border-hair-l bg-paper py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-6 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors',
                isActive(item)
                  ? 'bg-ash text-ink border-l-2 border-brand pl-[22px]'
                  : 'text-ink-2 hover:text-ink hover:bg-ash'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
