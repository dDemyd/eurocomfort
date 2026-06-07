import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { LocalizedRecord } from '@/lib/queries';

type Item = { title: string; text: string };

const icons = [
  <svg key="1" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /><circle cx="12" cy="8" r="6" /></svg>,
  <svg key="2" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>,
  <svg key="3" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></svg>,
  <svg key="4" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
];

export default function WhyUs({ content = {} }: { content?: LocalizedRecord }) {
  const t = useTranslations('why');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="about"
      className="relative bg-ash py-[clamp(72px,11vh,150px)]"
    >
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            <RichText value={content['why.title']}>
              {t('title1')}
              <br />
              {t('title2Brand')} <span className="mark">{t('title2Mark')}</span>
            </RichText>
          </Reveal>
          <Reveal
            as="p"
            i={2}
            className="lede col-span-12 md:col-span-4 md:col-start-9 md:row-start-3"
          >
            {content['why.lede'] || t('lede')}
          </Reveal>
        </header>

        <div className="grid grid-cols-12 items-start gap-x-6">
          <div className="col-span-12 lg:col-span-6">
            {items.map((it, idx) => (
              <Reveal
                key={it.title}
                i={idx}
                className={[
                  'grid grid-cols-[auto_1fr] gap-x-6 py-[30px]',
                  idx === 0 ? 'pt-0' : 'border-t border-hair-l',
                ].join(' ')}
              >
                <div className="text-ink">{icons[idx]}</div>
                <div>
                  <h3 className="mb-[10px] font-display font-bold uppercase leading-[1.05] tracking-tight2 text-[clamp(1.1rem,1.6vw,1.45rem)]">
                    {it.title}
                  </h3>
                  <p className="max-w-[42ch] text-[15.5px] leading-[1.6] text-ink-2">
                    {it.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal
            i={1}
            className="relative col-span-12 mt-12 max-w-[440px] self-stretch lg:col-span-5 lg:col-start-8 lg:mt-0 lg:max-w-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-[6px] -top-[14px] z-[3] font-display text-[120px] font-black leading-[0.6] text-brand"
            >
              ”
            </span>
            <div className="relative p-[10px]">
              <div className="relative aspect-[4/5] overflow-hidden border border-hair-l bg-[#161616]">
                <span className="cmark tr" />
                <span className="cmark bl" />
                <Image
                  src="/assets/owner.webp"
                  alt={t('ownerAlt')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover [filter:saturate(1.05)_contrast(1.02)]"
                />
              </div>
              <div className="mt-[18px] flex items-baseline justify-between gap-4">
                <span className="font-display text-[18px] font-bold uppercase tracking-[-0.01em]">
                  {t('ownerName')}
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-ink-2">
                  {t('ownerRole')}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
