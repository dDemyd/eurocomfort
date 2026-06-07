import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';

type Nav = { label: string; href: string };

export default function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const navLinks = t.raw('navLinks') as Nav[];
  const catalogLinks = t.raw('catalogLinks') as string[];

  return (
    <footer
      id="footer"
      className="bg-ink pt-[clamp(64px,9vh,120px)] text-white"
    >
      <div className="wrap">
        <div className="grid grid-cols-12 items-end gap-x-6 border-b border-hair-d pb-[clamp(56px,8vh,96px)]">
          <Reveal as="h2" className="col-span-12 font-display font-black uppercase leading-[0.92] tracking-tightest text-[clamp(2.2rem,6vw,5.4rem)] md:col-span-8">
            {t('ctaTitle1')}
            <br />
            {t('ctaTitle2')}{' '}
            <span className="text-brand">{t('ctaTitle2Mark')}</span>
          </Reveal>
          <Reveal i={1} className="col-span-12 mt-7 self-end justify-self-start md:col-span-3 md:col-start-10 md:mt-0 md:justify-self-end">
            <a href="#contact" className="btn btn--lg">
              {t('ctaButton')} <span className="arr">→</span>
            </a>
          </Reveal>
        </div>

        <a
          href={tCommon('mapsHref')}
          target="_blank"
          rel="noopener"
          aria-label={t('addressOpenAria')}
          className="my-10 flex flex-wrap items-center gap-5 border border-hair-d bg-[#0c0c0c] p-[22px_26px] transition-colors duration-200 ease-ease hover:border-brand hover:bg-[#101010]"
        >
          <span className="flex h-[46px] w-[46px] flex-none items-center justify-center border border-hair-d text-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
          </span>
          <span className="min-w-0 flex-1 text-[16px] text-white">
            <span className="mb-[6px] block font-mono text-[10.5px] uppercase tracking-monoXl text-white/50">
              {t('addressLabel')}
            </span>
            {tCommon('addressShort')}
          </span>
          <span className="flex-none whitespace-nowrap font-mono text-[11px] uppercase tracking-mono text-brand">
            {t('addressOpen')}
          </span>
        </a>

        <div className="grid grid-cols-1 gap-10 py-[clamp(48px,7vh,84px)] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/assets/logo.svg"
              alt="ЄВРО КОМФОРТ"
              width={140}
              height={30}
              className="mb-5 h-[30px] w-auto"
            />
            <p className="max-w-[34ch] text-[14px] leading-[1.6] text-white/60">
              {t('brandText')}
            </p>
            <div className="mt-[22px] flex gap-[10px]">
              {(['ig', 'fb', 'tg'] as const).map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-[42px] w-[42px] items-center justify-center border border-hair-d transition-colors duration-200 ease-ease hover:border-brand hover:bg-brand"
                >
                  {s === 'ig' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  )}
                  {s === 'fb' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  )}
                  {s === 'tg' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-[22px] font-mono text-[11px] uppercase tracking-monoXl text-white/45">
              {t('colNav')}
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="text-[15px] text-white/80 transition-colors hover:text-brand"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[22px] font-mono text-[11px] uppercase tracking-monoXl text-white/45">
              {t('colCatalog')}
            </h4>
            <ul className="flex flex-col gap-3">
              {catalogLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#catalog"
                    className="text-[15px] text-white/80 transition-colors hover:text-brand"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-[22px] font-mono text-[11px] uppercase tracking-monoXl text-white/45">
              {t('colContacts')}
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={tCommon('phoneHref')}
                  className="inline-flex items-center gap-[10px] text-[15px] text-white/80 transition-colors hover:text-brand"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.06 6.184z" /></svg>
                  {t('phoneFull')}
                </a>
              </li>
              <li>
                <a
                  href={tCommon('emailHref')}
                  className="inline-flex items-center gap-[10px] text-[15px] text-white/80 transition-colors hover:text-brand"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  {t('emailFull')}
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-[10px] text-[15px] text-white/80">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                  {t('addressFull')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-hair-d py-[26px] pb-[34px] font-mono text-[11px] tracking-[0.12em] text-white/50">
          <span>{t('copyright')}</span>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-brand">
              {t('privacy')}
            </a>
            <span>{t('designedBy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
