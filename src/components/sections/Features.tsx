import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { LocalizedRecord } from '@/lib/queries';

type Point = { n: string; title: string; text: string };

const icons = [
  <svg key="1" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12.99 6.74 1.93 3.44" /><path d="M19.136 12a10 10 0 0 1-14.271 0" /><path d="m21 21-2.16-3.84" /><path d="m3 21 8.02-14.26" /><circle cx="12" cy="5" r="2" /></svg>,
  <svg key="2" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /></svg>,
  <svg key="3" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>,
];

export default function Features({ content = {} }: { content?: LocalizedRecord }) {
  const t = useTranslations('features');
  const points = t.raw('points') as Point[];
  const lead = content['features.title'];

  return (
    <section
      id="approach"
      className="relative py-[clamp(70px,9vh,130px)]"
    >
      <div className="wrap grid grid-cols-12 gap-x-6">
        <Reveal
          as="p"
          className="col-span-12 mb-[clamp(48px,7vh,90px)] font-display font-bold uppercase leading-[1.02] tracking-tighter2 text-[clamp(1.8rem,4vw,3.3rem)] md:col-span-8"
        >
          <RichText value={lead}>
            <>
              {t('lead.before')} <span className="text-brand">{t('lead.mark')}</span>{' '}
              {t('lead.after')}
            </>
          </RichText>
        </Reveal>

        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3">
          {points.map((p, idx) => (
            <Reveal
              key={p.n}
              i={idx}
              as="article"
              className={[
                'relative px-0 py-[30px] md:px-[34px] md:pb-[38px] md:pt-[34px]',
                idx === 0
                  ? 'md:pl-0 border-t border-hair-l md:border-t-0'
                  : 'border-t border-hair-l md:border-l md:border-t-0',
              ].join(' ')}
            >
              <div className="mb-6 font-mono text-[12px] tracking-monoXl text-brand">
                {p.n}
              </div>
              <div className="mb-[22px] text-ink">{icons[idx]}</div>
              <h3 className="mb-[14px] font-display font-bold uppercase leading-[1.06] tracking-tight2 text-[clamp(1.15rem,1.7vw,1.5rem)]">
                {p.title}
              </h3>
              <p className="max-w-[34ch] text-[15.5px] leading-[1.6] text-ink-2">
                {p.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
