'use client';

import { useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import RichText from '@/components/RichText';
import type { LFaq } from '@/lib/categoryContent';

function QAItem({ q, a, n, i }: { q: string; a: string; n: string; i: number }) {
  const [open, setOpen] = useState(false);
  const ansRef = useRef<HTMLDivElement>(null);
  const maxH = open ? ansRef.current?.scrollHeight ?? 0 : 0;

  return (
    <Reveal as="div" i={i} className={`qa ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="qa__q"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="n">{n}</span>
        <span className="t">{q}</span>
        <span className="pm" aria-hidden="true" />
      </button>
      <div className="qa__a" ref={ansRef} style={{ maxHeight: maxH ? `${maxH}px` : undefined }}>
        <div className="qa__a-inner">{a}</div>
      </div>
    </Reveal>
  );
}

export default function CategoryFaqSection({ section }: { section: LFaq }) {
  return (
    <section className="csec s-lift" id="faq" data-screen-label="Категорія — питання">
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" i={0} className="eyebrow">
            {section.eyebrow}
          </Reveal>
          <Reveal as="h2" i={1} className="title">
            <RichText value={section.title} />
          </Reveal>
        </header>

        <div className="grid12">
          <div className="faq">
            {section.items.map((item, idx) => (
              <QAItem
                key={idx}
                i={idx}
                n={String(idx + 1).padStart(2, '0')}
                q={item.q}
                a={item.a}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
