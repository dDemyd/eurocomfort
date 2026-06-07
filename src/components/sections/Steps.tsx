import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { LocalizedRecord } from '@/lib/queries';

type Step = { n: string; title: string; text: string };

export default function Steps({ content = {} }: { content?: LocalizedRecord }) {
  const t = useTranslations('steps');
  const items = t.raw('items') as Step[];

  return (
    <section
      id="process"
      className="section--dark relative bg-ink py-[clamp(72px,11vh,150px)] text-white"
    >
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            <RichText value={content['process.title']}>
              {t('titleBefore')} <span className="mark">{t('titleMark')}</span>
            </RichText>
          </Reveal>
          <Reveal
            as="p"
            i={2}
            className="lede col-span-12 md:col-span-4 md:col-start-9 md:row-start-3"
          >
            {content['process.lede'] || t('lede')}
          </Reveal>
        </header>

        <div className="border-t border-hair-d">
          {items.map((s, idx) => (
            <Reveal
              key={s.n}
              i={idx}
              className="group grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-5 border-b border-hair-d py-[28px] md:grid-cols-[1.1fr_2fr_1.4fr] md:gap-[32px] md:py-[38px]"
            >
              <div
                className="font-display font-black leading-[0.8] tracking-tightest text-[3rem] md:text-[clamp(3.4rem,8vw,7rem)] text-transparent transition-all duration-300 ease-ease [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)] group-hover:[-webkit-text-stroke-color:#E11D2A]"
              >
                {s.n}
              </div>
              <div className="col-start-2 font-display font-extrabold uppercase leading-[0.98] tracking-tighter2 text-[clamp(1.3rem,2.4vw,2.1rem)]">
                {s.title}
              </div>
              <div className="col-span-2 text-[15.5px] leading-[1.6] text-white/60 md:col-span-1 md:col-start-3">
                {s.text}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
