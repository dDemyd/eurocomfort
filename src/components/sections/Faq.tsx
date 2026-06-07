'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';

type QA = { n: string; q: string; a: string };

function QAItem({
  item,
  i,
  open,
  onToggle,
}: {
  item: QA;
  i: number;
  open: boolean;
  onToggle: () => void;
}) {
  const ansRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState('0px');

  useEffect(() => {
    if (!ansRef.current) return;
    setMaxH(open ? `${ansRef.current.scrollHeight}px` : '0px');
  }, [open]);

  return (
    <Reveal
      i={i}
      className={`qa border-b border-hair-l ${open ? 'open' : ''}`}
    >
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
        ref={ansRef}
        style={{ maxHeight: maxH }}
        className="overflow-hidden transition-[max-height] duration-500 ease-ease"
      >
        <div className="max-w-[62ch] pb-8 pl-0 text-[16px] leading-[1.65] text-ink-2 md:pl-[64px]">
          {item.a}
        </div>
      </div>
    </Reveal>
  );
}

export default function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as QA[];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-[clamp(72px,11vh,150px)]">
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            {t('titleBefore')} <span className="mark">{t('titleMark')}</span>
          </Reveal>
        </header>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 border-t border-hair-l md:col-span-10 md:col-start-3">
            {items.map((it, idx) => (
              <QAItem
                key={it.n}
                item={it}
                i={idx}
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
