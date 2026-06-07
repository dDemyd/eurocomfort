'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function HeroParallaxBg({ alt }: { alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          el.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 -top-[6%] bottom-0 z-0 will-change-transform"
    >
      <Image
        src="/assets/hero.webp"
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover [filter:grayscale(1)_contrast(1.12)_brightness(.92)]"
      />
    </div>
  );
}
