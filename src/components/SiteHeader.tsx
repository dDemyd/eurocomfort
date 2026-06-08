'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import MobileNav from './MobileNav';
import type { LocalizedRecord } from '@/lib/queries';

const sectionIds = ['catalog', 'about', 'reviews', 'process', 'contact', 'footer'];

export default function SiteHeader({ settings = {} }: { settings?: LocalizedRecord }) {
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const phone = settings['contact.phone_display'] || '+380 (97) 969 04 03';
  const [phonePrefix, phoneRest] = phone.replace('+380 ', '+380|').split('|');

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
  }, []);

  const navItems = [
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
        <a href="#top" aria-label={t('ariaHome')} className="block">
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
