import Reveal from '@/components/Reveal';
import type { LHero } from '@/lib/categoryContent';
import type { Locale } from '@/i18n/routing';

const CRUMB = {
  home: { uk: 'Головна', ru: 'Главная' },
  catalog: { uk: 'Каталог', ru: 'Каталог' },
  aria: { uk: 'Хлібні крихти', ru: 'Хлебные крошки' },
};

export default function CategoryHero({ hero, locale }: { hero: LHero; locale: Locale }) {
  const prefix = locale === 'ru' ? '/ru' : '';

  return (
    <section className="cathero" data-screen-label="Категорія — шапка">
      <div className="cathero__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.image} alt={hero.imageAlt} fetchPriority="high" />
      </div>
      <div className="cathero__scrim" />
      <div className="cathero__corner">
        <span className="cmark" />
        <span className="cmark tr" />
        <span className="cmark bl" />
        <span className="cmark br" />
      </div>
      <div className="cathero__inner">
        <Reveal as="p" i={0} className="cathero__index">
          {hero.index}
        </Reveal>
        <Reveal as="div" i={1}>
          <nav className="crumbs" aria-label={CRUMB.aria[locale]}>
            <a href={`${prefix}/`}>{CRUMB.home[locale]}</a>
            <span className="sep">/</span>
            <a href={`${prefix}/#catalog`}>{CRUMB.catalog[locale]}</a>
            <span className="sep">/</span>
            <span className="cur">{hero.title}</span>
          </nav>
        </Reveal>
        <Reveal as="h1" i={2}>
          {hero.title}
        </Reveal>
        <Reveal as="p" i={3} className="cathero__desc">
          {hero.desc}
        </Reveal>
        <Reveal as="div" i={4} className="cathero__chips">
          {hero.chips.map((chip, idx) => (
            <span key={idx} className="chip">
              {chip}
            </span>
          ))}
        </Reveal>
        <Reveal as="div" i={5} className="cathero__cta">
          <a className="btn btn--lg" href="#contact">
            {hero.ctaLabel}{' '}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
