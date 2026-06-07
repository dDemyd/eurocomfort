import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import HeroParallaxBg from '../HeroParallaxBg';
import RichText from '../RichText';
import type { LocalizedRecord } from '@/lib/queries';

type Stat = { v: string; em: string; k: string };

export default function Hero({ content = {} }: { content?: LocalizedRecord }) {
  const t = useTranslations('hero');
  const stats = t.raw('stats') as Stat[];
  const statLabels = [
    content['stats.experience'],
    content['stats.projects'],
    content['stats.satisfaction'],
  ];
  const customTitle = content['hero.title'];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] overflow-hidden bg-ink text-white"
    >
      {/* фон с параллаксом */}
      <HeroParallaxBg alt={t('imageAlt')} />
      <div className="hero-scrim pointer-events-none absolute inset-0 z-[1]" />

      {/* уголковые метки */}
      <div className="pointer-events-none absolute inset-[18px] z-[4]">
        <span className="cmark !w-8 !h-8" />
        <span className="cmark tr !w-8 !h-8" />
        <span className="cmark bl !w-8 !h-8" />
        <span className="cmark br !w-8 !h-8" />
      </div>

      {/* контент */}
      <div className="hero-content relative z-[5] mx-auto grid w-full max-w-wrap grid-cols-12 gap-x-6 content-center px-[var(--gutter)] pb-[clamp(230px,30vh,320px)] pt-[120px]">
        <div
          className="col-span-1 hidden self-center font-mono text-[12px] tracking-[0.28em] text-brand md:[writing-mode:vertical-rl] md:rotate-180 md:block"
          aria-hidden="true"
        >
          {t('index')}
        </div>

        <div className="col-span-12 md:col-span-11 md:col-start-2">
          <Reveal
            as="p"
            i={0}
            className="eyebrow !text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]"
            style={{ fontWeight: 500, letterSpacing: '0.24em' }}
          >
            {t('eyebrow')}
          </Reveal>

          <h1 className="mt-[14px] font-display font-black uppercase leading-[0.9] tracking-tightest text-[clamp(2.9rem,8.2vw,8.4rem)] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            {customTitle ? (
              <Reveal line i={1} as="span">
                <RichText value={customTitle} />
              </Reveal>
            ) : (
              <>
                <Reveal line i={1} as="span">
                  {t('line1')}
                </Reveal>
                <Reveal line i={2} as="span">
                  {t('line2')}
                </Reveal>
                <Reveal line i={3} as="span">
                  <span className="text-brand">{t('line3')}</span>
                </Reveal>
              </>
            )}
            <Reveal
              as="span"
              i={5}
              className="mt-[30px] block max-w-[48ch] font-body text-[clamp(15px,1.6vw,20px)] font-light normal-case leading-[1.55] tracking-[-0.005em] text-white/90"
            >
              {content['hero.subtitle'] || t('sub')}
            </Reveal>
          </h1>

          <Reveal
            i={6}
            className="mt-10 flex flex-wrap items-center gap-[30px] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
          >
            <a href="#contact" className="btn btn--lg">
              {content['hero.cta'] || t('ctaPrimary')} <span className="arr">→</span>
            </a>
            <a
              href="#catalog"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white"
            >
              {t('ctaScroll')}
            </a>
          </Reveal>
        </div>
      </div>

      {/* stats */}
      <div className="hero-stats absolute inset-x-[var(--gutter)] bottom-10 z-[5] mx-auto flex max-w-wrap flex-wrap gap-x-[clamp(28px,5vw,80px)] gap-y-4 border-t border-hair-d pt-6">
        {stats.map((s, idx) => (
          <Reveal key={idx} i={idx}>
            <div className="font-mono text-[clamp(26px,3vw,38px)] font-bold leading-none tracking-tight2 tabular-nums">
              {s.v}
              <em className="not-italic text-brand">{s.em}</em>
            </div>
            <div className="mt-2 max-w-[20ch] font-body text-[13px] font-light leading-[1.4] text-white/60">
              {statLabels[idx] || s.k}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
