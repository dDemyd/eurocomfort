import Reveal from '@/components/Reveal';
import RichText from '@/components/RichText';
import type { LSpecs } from '@/lib/categoryContent';

export default function SpecsSection({
  section,
  variant,
}: {
  section: LSpecs;
  variant: 'base' | 'lift';
}) {
  return (
    <section className={`csec s-${variant}`} id="specs" data-screen-label="Категорія — характеристики">
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" i={0} className="eyebrow">
            {section.eyebrow}
          </Reveal>
          <Reveal as="h2" i={1} className="title">
            <RichText value={section.title} />
          </Reveal>
        </header>

        <div className="specs__grid">
          {section.columns.map((col, colIdx) => (
            <Reveal key={colIdx} as="div" i={colIdx} className="spec-col">
              {col.map((row, rowIdx) => (
                <div key={rowIdx} className="specrow">
                  <span className="k">{row.k}</span>
                  <span className="v">
                    {row.v}
                    {row.small ? <small> {row.small}</small> : null}
                  </span>
                </div>
              ))}
            </Reveal>
          ))}
        </div>

        {section.note ? (
          <Reveal as="p" i={2} className="specs__note">
            {section.note}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
