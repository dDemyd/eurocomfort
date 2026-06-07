import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { LocalizedRecord, Testimonial } from '@/lib/queries';

type Review = { text: string; avatar: string; name: string; role: string };

export default function Testimonials({
  testimonials = [],
  content = {},
}: {
  testimonials?: Testimonial[];
  content?: LocalizedRecord;
}) {
  const t = useTranslations('reviews');
  const fallbackItems = t.raw('items') as Review[];
  const items =
    testimonials.length > 0
      ? testimonials.map((review) => ({
          text: review.body,
          avatar: review.author.slice(0, 2).toUpperCase(),
          name: review.author,
          role: '',
        }))
      : fallbackItems;
  const clients = t.raw('clients') as string[];

  return (
    <section
      id="reviews"
      className="relative bg-ash py-[clamp(72px,11vh,150px)]"
    >
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            <RichText value={content['reviews.title']}>
              {t('titleBefore')} <span className="mark">{t('titleMark')}</span>
            </RichText>
          </Reveal>
          <Reveal
            as="p"
            i={2}
            className="lede col-span-12 md:col-span-4 md:col-start-9 md:row-start-3"
          >
            {content['reviews.lede'] || t('lede')}
          </Reveal>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((rev, idx) => (
            <Reveal
              key={rev.name}
              i={idx}
              as="article"
              className="relative border border-hair-l bg-paper p-[40px_34px_34px]"
            >
              <span
                aria-hidden="true"
                className="block h-[42px] font-display text-[84px] font-black leading-[0.5] text-brand"
              >
                ”
              </span>
              <p className="mb-7 mt-5 text-[16.5px] leading-[1.62] text-[#1a1a1a]">
                {rev.text}
              </p>
              <div className="flex items-center gap-[14px] border-t border-hair-l pt-5">
                <span className="flex h-[42px] w-[42px] flex-none items-center justify-center bg-ash font-display text-[15px] font-extrabold">
                  {rev.avatar}
                </span>
                <div>
                  <div className="font-display text-[14px] font-bold uppercase tracking-[-0.01em]">
                    {rev.name}
                  </div>
                  <div className="mt-[3px] font-mono text-[10.5px] tracking-[0.14em] text-ink-2">
                    {rev.role}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          i={1}
          className="mt-[clamp(40px,6vh,72px)] flex flex-col items-center gap-[26px] border-t border-hair-l pt-[34px]"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-2">
            {t('clientsLabel')}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-[clamp(28px,5vw,64px)]">
            {clients.map((c) => (
              <span
                key={c}
                className="font-display font-extrabold uppercase tracking-[-0.01em] text-[clamp(18px,2.4vw,26px)] text-[#1a1a1a] opacity-40 transition-opacity duration-200 ease-ease hover:opacity-90"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
