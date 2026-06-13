'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { getCatalogPages } from '@/lib/catalogPages';

type Item = { n: string; label: string; href: string };

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const items = t.raw('mobileNav.items') as Item[];
  const catalogPages = getCatalogPages(locale);
  const backLabel = locale === 'ru' ? 'Все разделы' : 'Усі розділи';
  const catalogTriggerLabel = locale === 'ru' ? 'Открыть каталог систем' : 'Відкрити каталог систем';
  const [subOpen, setSubOpen] = useState(false);

  useEffect(() => {
    if (!open) setSubOpen(false);
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      style={{
        transform: open ? 'translateY(0)' : 'translateY(-100%)',
        visibility: open ? 'visible' : 'hidden',
      }}
      className="fixed inset-0 z-[70] flex flex-col bg-ink text-white px-[var(--gutter)] pb-12 pt-6 transition-transform duration-500 ease-ease lg:hidden"
    >
      <div className="mb-auto flex items-center justify-between">
        <Image
          src="/assets/logo.svg"
          alt={t('header.logoAlt')}
          width={140}
          height={28}
          className="h-7 w-auto"
        />
        <button
          type="button"
          aria-label={t('header.closeMenu')}
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-[26px]"
        >
          ✕
        </button>
      </div>

      <div className="my-auto overflow-x-hidden overflow-y-auto">
        <div
          className="flex w-[200%] transition-transform duration-500 ease-ease"
          style={{ transform: subOpen ? 'translateX(-50%)' : 'translateX(0)' }}
        >
          <div className="w-1/2 flex-none">
            <ul className="flex flex-col gap-[6px]">
              {items.map((item, idx) => (
                <li
                  key={item.href}
                  className={[
                    'border-t border-hair-d',
                    idx === items.length - 1 ? 'border-b' : '',
                  ].join(' ')}
                >
                  {idx === 0 ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.currentTarget.blur();
                        setSubOpen(true);
                      }}
                      aria-label={catalogTriggerLabel}
                      className="flex w-full items-center gap-4 py-5 text-left font-display font-extrabold uppercase tracking-tighter2 text-[clamp(2rem,9vw,3rem)]"
                    >
                      <span className="font-mono text-[12px] font-normal tracking-monoXl text-brand">
                        {item.n}
                      </span>
                      {item.label}
                      <span className="ml-auto flex text-brand" aria-hidden="true">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-baseline gap-4 py-5 font-display font-extrabold uppercase tracking-tighter2 text-[clamp(2rem,9vw,3rem)]"
                    >
                      <span className="font-mono text-[12px] font-normal tracking-monoXl text-brand">
                        {item.n}
                      </span>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2 flex-none">
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                setSubOpen(false);
              }}
              className="inline-flex items-center gap-3 pb-[22px] pt-[6px] font-mono text-[12px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
            >
              <span className="flex text-brand" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </span>
              {backLabel}
            </button>
            <ul className="flex flex-col gap-[6px]">
              {catalogPages.map((page) => (
                <li key={page.href} className="border-t border-hair-d last:border-b">
                  <a
                    href={page.href}
                    onClick={onClose}
                    className="flex items-baseline gap-4 py-5 font-display font-extrabold uppercase tracking-tighter2 text-[clamp(1.6rem,6.6vw,2.3rem)]"
                  >
                    <span className="font-mono text-[12px] font-normal tracking-monoXl text-brand">
                      {page.index}
                    </span>
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-2 font-mono text-[12px] tracking-[0.1em] text-white/60">
        <span>
          {t('mobileNav.footPhonePrefix')}{' '}
          <b className="text-white">{t('mobileNav.footPhoneRest')}</b>
        </span>
        <span>{t('mobileNav.footEmail')}</span>
        <span>{t('mobileNav.footAddress')}</span>
      </div>
    </div>
  );
}
