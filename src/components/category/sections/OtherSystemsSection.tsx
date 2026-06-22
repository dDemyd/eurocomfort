import Reveal from '@/components/Reveal';
import { getCatalogPages } from '@/lib/catalogPages';
import type { Locale } from '@/i18n/routing';

const TILE_IMAGE: Record<string, string> = {
  'panoramic-glazing': '/assets/interior.webp',
  'facade-glazing': '/assets/facade.webp',
  'sliding-systems': '/assets/sliding.webp',
  'custom-forms': '/assets/custom.webp',
};

const COPY = {
  eyebrow: { uk: '08 — Каталог', ru: '08 — Каталог' },
  titleBefore: { uk: 'Інші ', ru: 'Другие ' },
  titleMark: { uk: 'системи', ru: 'системы' },
  cta: { uk: 'дивитись систему', ru: 'смотреть систему' },
};

export default function OtherSystemsSection({
  locale,
  currentSlug,
}: {
  locale: Locale;
  currentSlug: string;
}) {
  const others = getCatalogPages(locale).filter((page) => page.slug !== currentSlug);

  return (
    <section className="csec s-lift others" id="others" data-screen-label="Категорія — інші системи">
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" i={0} className="eyebrow">
            {COPY.eyebrow[locale]}
          </Reveal>
          <Reveal as="h2" i={1} className="title">
            {COPY.titleBefore[locale]}
            <span className="mark">{COPY.titleMark[locale]}</span>
          </Reveal>
        </header>

        <div className="grid12">
          <div className="grid-3">
            {others.map((page, idx) => (
              <Reveal
                key={page.slug}
                as="a"
                i={idx}
                className="tile"
                href={page.href}
                aria-label={page.label}
              >
                <div className="tile__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={TILE_IMAGE[page.slug]} alt={page.label} loading="lazy" />
                </div>
                <span className="cmark tr" />
                <span className="cmark bl" />
                <div className="tile__grad" />
                <div className="tile__cap">
                  <div className="tn">
                    {page.index} / {page.slug.toUpperCase()}
                  </div>
                  <h3>{page.label}</h3>
                  <div className="meta">
                    <span>→</span> {COPY.cta[locale]}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
