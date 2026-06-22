import Reveal from '@/components/Reveal';
import RichText from '@/components/RichText';
import AnatomyDiagram from '../diagrams/AnatomyDiagram';
import type { LAnatomy } from '@/lib/categoryContent';
import type { Locale } from '@/i18n/routing';

const STAGE_MOD: Record<string, string> = {
  panoramic: '',
  facade: ' anatomy__stage--facade',
  sliding: '',
  custom: ' anatomy__stage--full',
};

export default function AnatomySection({
  section,
  variant,
  locale,
}: {
  section: LAnatomy;
  variant: 'base' | 'lift';
  locale: Locale;
}) {
  return (
    <section
      className={`csec s-${variant} anatomy`}
      id="anatomy"
      data-screen-label="Категорія — анатомія"
    >
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

        <Reveal as="div" i={1} className={`anatomy__stage${STAGE_MOD[section.diagram] ?? ''}`}>
          <span className="cmark" />
          <span className="cmark tr" />
          <span className="cmark bl" />
          <span className="cmark br" />
          {section.tags ? (
            <>
              <span className="anatomy__tag">{section.tags.left}</span>
              <span className="anatomy__tag r">{section.tags.right}</span>
            </>
          ) : null}
          <AnatomyDiagram diagram={section.diagram} parts={section.parts} locale={locale} />
        </Reveal>

        <Reveal as="div" i={2} className="anatomy__note">
          {section.notes.map((n, idx) => (
            <div key={idx}>
              <b>
                <i>{n.idx}</i>
                {n.label}
              </b>
              {n.text}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
