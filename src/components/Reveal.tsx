'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  i?: number;
  className?: string;
  children: ReactNode;
  line?: boolean;
  style?: CSSProperties;
  as?: 'div' | 'span' | 'p' | 'article' | 'section' | 'a' | 'h1' | 'h2' | 'h3' | 'h4';
  /** только для as="a" */
  href?: string;
  'aria-label'?: string;
};

export default function Reveal({
  i = 0,
  className = '',
  children,
  line = false,
  style,
  as = 'div',
  href,
  'aria-label': ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }
    // элемент уже в зоне видимости или прокручен выше — показать без задержки
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh * 0.9) {
      el.classList.add('in');
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';
  const cls = `${line ? 'reveal-line' : 'reveal'} ${className}`.trim();
  const finalStyle = { ...style, ['--i' as string]: i } as CSSProperties;
  const extra = as === 'a' ? { href, 'aria-label': ariaLabel } : {};

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cls}
      style={finalStyle}
      {...extra}
    >
      {line ? <span>{children}</span> : children}
    </Tag>
  );
}
