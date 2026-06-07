'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import RichText from '../RichText';
import type { FaqItem, LocalizedRecord } from '@/lib/queries';

type QA = { n: string; q: string; a: string };

function QAItem({
  item,
  open,
  onToggle,
}: {
  item: QA;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`qa border-b border-hair-l ${open ? 'open' : ''}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full min-h-[44px] items-center gap-6 py-[30px] text-left"
      >
        <span className="w-10 flex-none font-mono text-[12px] tracking-mono text-brand">
          {item.n}
        </span>
        <span className="flex-1 font-display font-bold uppercase leading-[1.1] tracking-tight2 text-[clamp(1.05rem,1.7vw,1.45rem)]">
          {item.q}
        </span>
        <span className="qa-pm" aria-hidden="true" />
      </button>
      <div
        className={[
          'grid transition-[grid-template-rows] duration-300 ease-ease',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="max-w-[62ch] pb-8 pl-0 text-[16px] leading-[1.65] text-ink-2 md:pl-[64px]">
            {item.a}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq({
  items: dbItems = [],
  content = {},
}: {
  items?: FaqItem[];
  content?: LocalizedRecord;
}) {
  const t = useTranslations('faq');
  const fallbackItems = t.raw('items') as QA[];
  const items =
    dbItems.length > 0
      ? dbItems.map((item, index) => ({
          n: String(index + 1).padStart(2, '0'),
          q: item.question,
          a: item.answer,
        }))
      : fallbackItems;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-[clamp(72px,11vh,150px)]">
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            <RichText value={content['faq.title']}>
              {t('titleBefore')} <span className="mark">{t('titleMark')}</span>
            </RichText>
          </Reveal>
        </header>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 border-t border-hair-l md:col-span-10 md:col-start-3">
            {items.map((it, idx) => (
              <QAItem
                key={it.n}
                item={it}
                open={openIdx === idx}
                onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
