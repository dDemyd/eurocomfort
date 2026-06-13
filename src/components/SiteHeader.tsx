'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import MobileNav from './MobileNav';
import { getCatalogPages } from '@/lib/catalogPages';
import type { LocalizedRecord } from '@/lib/queries';

const homeSectionIds = ['catalog', 'about', 'reviews', 'process', 'contact', 'footer'];
const categorySectionIds = ['top', 'about-system', 'specs', 'projects', 'contact', 'footer'];

export default function SiteHeader({
  settings = {},
  variant = 'home',
}: {
  settings?: LocalizedRecord;
  variant?: 'home' | 'category';
}) {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const phone = settings['contact.phone_display'] || '+380 (97) 969 04 03';
  const [phonePrefix, phoneRest] = phone.replace('+380 ', '+380|').split('|');
  const catalogPages = getCatalogPages(locale);
  const sectionIds = variant === 'category' ? categorySectionIds : homeSectionIds;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
      .sort((a, b) => a.offsetTop - b.offsetTop);

    if (sections.length === 0) return;

    const applyHashSection = () => {
      const hashId = window.location.hash.slice(1);

      if (sectionIds.includes(hashId)) {
        setActiveSection(hashId);
        return true;
      }

      return false;
    };

    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.35;
      let current: string | null = null;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          current = section.id;
        }
      }

      setActiveSection(current);
    };

    if (!applyHashSection()) updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', applyHashSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', applyHashSection);
    };
  }, [sectionIds]);

  const navItems =
    variant === 'category'
      ? [
          { href: '#top', id: 'top', label: t('nav.catalog') },
          { href: '#about-system', id: 'about-system', label: locale === 'ru' ? 'О системе' : 'Про систему' },
          { href: '#specs', id: 'specs', label: locale === 'ru' ? 'Характеристики' : 'Характеристики' },
          { href: '#projects', id: 'projects', label: locale === 'ru' ? 'Проекты' : 'Проєкти' },
          { href: '#contact', id: 'contact', label: t('nav.contact') },
        ]
      : [
          { href: '#catalog', id: 'catalog', label: t('nav.catalog') },
          { href: '#about', id: 'about', label: t('nav.about') },
          { href: '#reviews', id: 'reviews', label: t('nav.reviews') },
          { href: '#process', id: 'process', label: t('nav.process') },
          { href: '#footer', id: 'footer', label: t('nav.contact') },
        ];

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-[60] flex items-center gap-10 border-b transition-all duration-300 ease-ease',
          'px-[var(--gutter)]',
          scrolled
            ? 'border-hair-d bg-[rgba(10,10,10,0.86)] py-[14px] backdrop-blur-md'
            : 'border-transparent py-[22px]',
        ].join(' ')}
      >
        <a href={variant === 'category' ? '/' : '#top'} aria-label={t('ariaHome')} className="block">
          <Image
            src="/assets/logo.svg"
            alt={t('logoAlt')}
            width={160}
            height={34}
            priority
            className={['w-auto transition-all duration-300 ease-ease', scrolled ? 'h-7' : 'h-[34px]'].join(' ')}
          />
        </a>

        <nav
          aria-label={t('ariaNav')}
          className="ml-auto hidden gap-[clamp(18px,2vw,34px)] lg:flex"
        >
          {navItems.map((item) => {
            if ((variant === 'home' && item.id === 'catalog') || (variant === 'category' && item.id === 'top')) {
              return (
                <div
                  key={item.href}
                  className="group relative flex items-center"
                >
                  <a
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-active={activeSection === item.id ? 'true' : undefined}
                    className="site-nav-link relative inline-flex items-center gap-[7px] whitespace-nowrap py-[6px] font-mono uppercase text-[11.5px] tracking-[0.18em]"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex transition-transform duration-300 ease-ease group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </a>
                  <div
                    role="menu"
                    aria-label="Системи"
                    className="invisible pointer-events-none absolute left-1/2 top-[calc(100%+14px)] z-[80] w-[min(380px,calc(100vw-32px))] -translate-x-1/2 translate-y-2 border border-hair-d bg-[rgba(11,11,11,0.97)] p-[7px] opacity-0 backdrop-blur-[14px] transition-all duration-300 ease-ease before:absolute before:left-0 before:right-0 before:top-[-16px] before:h-4 before:content-[''] group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  >
                    {catalogPages.map((page) => (
                      <a
                        key={page.href}
                        role="menuitem"
                        href={page.href}
                        aria-current={pathname?.endsWith(page.href) ? 'page' : undefined}
                        className={[
                          'grid grid-cols-[auto_1fr_auto] items-center gap-x-[18px] border-t border-hair-d px-[18px] py-[17px] text-white transition-colors duration-200 ease-ease first:border-t-0 hover:bg-[#161616]',
                          pathname?.endsWith(page.href) ? 'bg-[#141414]' : '',
                        ].join(' ')}
                      >
                        <span className="font-mono text-[12px] tracking-[0.16em] text-brand">
                          {page.index}
                        </span>
                        <span className="min-w-0 font-display text-[16px] font-bold uppercase leading-none tracking-normal">
                          {page.label}
                        </span>
                        <span className="font-mono text-white/35 transition-all duration-200 ease-ease">
                          →
                        </span>
                        <span className="col-start-2 mt-[5px] block font-body text-[12.5px] font-light text-white/50">
                          {page.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                data-active={activeSection === item.id ? 'true' : undefined}
                className="site-nav-link relative inline-block whitespace-nowrap py-[6px] font-mono uppercase text-[11.5px] tracking-[0.18em]"
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <a
          href="tel:+380979690403"
          className="hidden whitespace-nowrap border-l border-hair-d pl-[26px] font-mono text-[12px] tracking-[0.06em] text-white lg:inline-block"
        >
          {phonePrefix || t('phonePrefix')} <b className="font-medium text-brand">{phoneRest || t('phoneRest')}</b>
        </a>

        <a
          href="#contact"
          onClick={() => setActiveSection('contact')}
          className="hidden min-h-11 items-center justify-center bg-brand px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-200 ease-ease hover:bg-[#B5141F] xl:inline-flex"
        >
          {t('cta')}
        </a>

        <button
          type="button"
          aria-label={t('openMenu')}
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="ml-auto flex h-11 w-11 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span className="block h-[1.5px] w-[26px] bg-white" />
          <span className="block h-[1.5px] w-[18px] bg-white" />
          <span className="block h-[1.5px] w-[26px] bg-white" />
        </button>
      </header>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
