'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Вертикальная полоска прогресса скролла в правой части viewport-а.
 * mix-blend-mode: difference автоматически инвертирует цвет на тёмных
 * и светлых секциях, поэтому всегда читаемо.
 * Скрывается на экранах <1024px (там нет места).
 *
 * Если включён prefers-reduced-motion — рендерится статично без подписки на scroll.
 */
export default function ScrollSpine() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (fillRef.current) {
        fillRef.current.style.height = `${(p * 100).toFixed(1)}%`;
      }
      setPct(Math.round(p * 100));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-[26px] z-[50] hidden flex-col items-center justify-center gap-4 [mix-blend-mode:difference] lg:flex"
    >
      <span
        className="font-mono text-[10px] tracking-[0.22em] text-white [writing-mode:vertical-rl] rotate-180"
      >
        SCROLL
      </span>
      <div className="relative h-[34vh] w-px bg-white/25">
        <span
          ref={fillRef}
          className="absolute left-[-1.5px] top-0 block h-0 w-[4px] bg-brand"
          style={{ transition: 'height .15s linear' }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-[0.1em] text-brand tabular-nums">
        {String(pct).padStart(2, '0')}
      </span>
    </div>
  );
}
