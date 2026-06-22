import Reveal from '@/components/Reveal';
import RichText from '@/components/RichText';
import AboutIcon from '../diagrams/AboutIcon';
import type { LAbout } from '@/lib/categoryContent';

const POINT_MOD = ['apoint--a', 'apoint--b', 'apoint--c'];

export default function AboutSection({
  section,
  variant,
}: {
  section: LAbout;
  variant: 'base' | 'lift';
}) {
  return (
    <section
      className={`csec s-${variant}`}
      id="about-system"
      data-screen-label="Категорія — про систему"
    >
      <div className="wrap">
        <div className="aboutsys">
          <div className="aboutsys__lead">
            <Reveal as="p" i={0} className="eyebrow">
              {section.eyebrow}
            </Reveal>
            <Reveal as="h2" i={1} className="aboutsys__claim">
              <RichText value={section.title} />
            </Reveal>
            <Reveal as="div" i={2} className="aboutsys__intro">
              {section.intro.map((p, idx) => (
                <p key={idx}>
                  <RichText value={p} />
                </p>
              ))}
            </Reveal>
          </div>

          {section.points.map((point, idx) => (
            <Reveal
              key={idx}
              as="div"
              i={3 + idx}
              className={`apoint ${POINT_MOD[idx] ?? ''}`}
            >
              <span className="apoint__ic" aria-hidden="true">
                <AboutIcon name={point.icon} />
              </span>
              <h3>{point.title}</h3>
            </Reveal>
          ))}

          <Reveal as="div" i={6} className="aboutsys__apps">
            <span className="k">{section.apps.label}</span>
            <span className="v">{section.apps.value}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
