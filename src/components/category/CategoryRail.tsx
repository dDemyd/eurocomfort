import { getCatalogPages } from '@/lib/catalogPages';

export default function CategoryRail({
  locale,
  currentSlug,
}: {
  locale: string;
  currentSlug: string;
}) {
  const pages = getCatalogPages(locale);

  return (
    <nav className="catrail" aria-label="Системи каталогу">
      <span className="catrail__line" aria-hidden="true" />
      {pages.map((page) => {
        const current = page.slug === currentSlug;

        return (
          <a
            key={page.slug}
            className={['catrail__item', current ? 'current' : ''].filter(Boolean).join(' ')}
            href={page.href}
            aria-current={current ? 'page' : undefined}
          >
            <span className="catrail__dot">{page.index}</span>
            <span className="catrail__name">{page.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
