'use client';

import { useEffect } from 'react';

export default function CategoryInteractions() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.cat-content .reveal, .cat-content .reveal-line'));

    const show = (el: HTMLElement) => el.classList.add('in');

    if (reduce || !('IntersectionObserver' in window)) {
      revealEls.forEach(show);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );
      revealEls.forEach((el) => io.observe(el));
      const fallback = window.setTimeout(() => revealEls.forEach(show), 1800);

      return () => {
        window.clearTimeout(fallback);
        io.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const configs = Array.from(document.querySelectorAll<HTMLElement>('[data-variants]'));

    const cleanups = configs.flatMap((conf) => {
      const rows = Array.from(conf.querySelectorAll<HTMLElement>('.vrow[data-v]'));
      const activate = (value: string | null) => {
        if (!value) return;
        conf.querySelectorAll<HTMLElement>('[data-v]').forEach((el) => {
          const on = el.dataset.v === value;
          el.classList.toggle('is-active', on);
          if (el.classList.contains('vrow')) el.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      };

      return rows.flatMap((row) => {
        const value = row.dataset.v ?? null;
        const handler = () => activate(value);
        row.addEventListener('click', handler);
        row.addEventListener('mouseenter', handler);
        row.addEventListener('focus', handler);

        return [
          () => row.removeEventListener('click', handler),
          () => row.removeEventListener('mouseenter', handler),
          () => row.removeEventListener('focus', handler),
        ];
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.cat-content .qa'));

    const cleanups = items.flatMap((item) => {
      const button = item.querySelector<HTMLButtonElement>('.qa__q');
      const answer = item.querySelector<HTMLElement>('.qa__a');
      if (!button || !answer) return [];

      const setOpen = (open: boolean) => {
        item.classList.toggle('open', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        answer.style.maxHeight = open ? `${answer.scrollHeight}px` : '';
      };

      const onClick = () => {
        const nextOpen = !item.classList.contains('open');
        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove('open');
          other.querySelector<HTMLButtonElement>('.qa__q')?.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.querySelector<HTMLElement>('.qa__a');
          if (otherAnswer) otherAnswer.style.maxHeight = '';
        });
        setOpen(nextOpen);
      };

      button.addEventListener('click', onClick);

      return [() => button.removeEventListener('click', onClick)];
    });

    const onResize = () => {
      document.querySelectorAll<HTMLElement>('.cat-content .qa.open .qa__a').forEach((answer) => {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
