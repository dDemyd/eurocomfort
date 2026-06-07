'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Item = { n: string; label: string; href: string };

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const items = t.raw('mobileNav.items') as Item[];

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

      <ul className="flex flex-col gap-[6px]">
        {items.map((item, idx) => (
          <li
            key={item.href}
            className={[
              'border-t border-hair-d',
              idx === items.length - 1 ? 'border-b' : '',
            ].join(' ')}
          >
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
          </li>
        ))}
      </ul>

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
