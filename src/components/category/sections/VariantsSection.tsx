'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import RichText from '@/components/RichText';
import VariantSchematics from '../diagrams/VariantSchematics';
import type { LVariants } from '@/lib/categoryContent';

export default function VariantsSection({
  section,
  variant,
  diagram,
}: {
  section: LVariants;
  variant: 'base' | 'lift';
  diagram: string;
}) {
  const [active, setActive] = useState(0);
  const caps = section.items.map((it) => it.schematic);

  return (
    <section className={`csec s-${variant}`} id="variants" data-screen-label="Категорія — варіанти">
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" i={0} className="eyebrow">
            {section.eyebrow}
          </Reveal>
          <Reveal as="h2" i={1} className="title">
            <RichText value={section.title} />
          </Reveal>
          <Reveal as="p" i={2} className="lede">
            {section.lede}
          </Reveal>
        </header>

        <Reveal as="div" i={0} className="vconf">
          <div className="vconf__stage">
            <span className="cmark" />
            <span className="cmark tr" />
            <span className="cmark bl" />
            <span className="cmark br" />
            <span className="vconf__plan">{section.planLabel}</span>

            <div className="vconf__photos">
              {section.items.map((it, i) => (
                <img
                  key={i}
                  className={`vconf__photo ${active === i ? 'is-active' : ''}`}
                  src={it.image}
                  alt={it.imageAlt}
                  loading="lazy"
                />
              ))}
            </div>

            <div className="vconf__read">
              <div className="vconf__schem">
                <VariantSchematics diagram={diagram} active={active} caps={caps} />
              </div>
              <div className="vconf__cap">
                {section.items.map((it, i) => (
                  <div key={i} className={`vcap ${active === i ? 'is-active' : ''}`}>
                    <span className="vcap__n">{it.captionN}</span>
                    <h3>{it.title}</h3>
                    <p>{it.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="vconf__list">
            {section.items.map((it, i) => (
              <button
                key={i}
                className={`vrow ${active === i ? 'is-active' : ''}`}
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="vrow__idx">{it.idx}</span>
                <span className="vrow__main">
                  <span className="vrow__name">{it.name}</span>
                  <span className="vrow__spec">{it.spec}</span>
                </span>
              </button>
            ))}
            <a className="vconf__cta" href="#contact">
              {section.ctaLabel}{' '}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
