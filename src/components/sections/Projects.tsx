'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import type { LocalizedRecord, Project } from '@/lib/queries';

type Slide = {
  image: string;
  alt: string;
  loc: string;
  sys: string;
  ratio: 'tall' | 'wide' | 'md';
};
type Placeholder = { loc: string; sys: string; ratio: 'tall' | 'wide' | 'md'; label: string };

const ratioClass: Record<Slide['ratio'], string> = {
  tall: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
  md: 'aspect-square',
};

export default function Projects({
  projects = [],
  content = {},
}: {
  projects?: Project[];
  content?: LocalizedRecord;
}) {
  const t = useTranslations('projects');
  const fallbackSlides = t.raw('slides') as Slide[];
  const slides =
    projects.length > 0
      ? projects.map((project, index) => ({
          image: project.cover || project.images[0] || fallbackSlides[index % fallbackSlides.length]?.image || '/assets/facade.webp',
          alt: project.title || project.location,
          loc: project.location || project.title,
          sys: project.system || project.description,
          ratio: (index % 3 === 0 ? 'tall' : index % 3 === 1 ? 'wide' : 'md') as Slide['ratio'],
        }))
      : fallbackSlides;
  const placeholders = t.raw('placeholders') as Placeholder[];

  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(8);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const movedRef = useRef(false);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAuto = (resumeAfter = 0) => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    if (resumeAfter > 0) {
      resumeTimerRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, resumeAfter);
    }
  };

  const advance = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    pauseAuto(2500);
    track.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  const update = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    setProgress(8 + p * 92);
    setAtStart(track.scrollLeft < 4);
    setAtEnd(track.scrollLeft > max - 4);
  };

  const step = () => {
    const first = trackRef.current?.querySelector('[data-slide]') as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + 24 : 360;
  };

  useEffect(() => {
    update();
    const t = setTimeout(update, 400);
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ping-pong auto-scroll
  useEffect(() => {
    const track = trackRef.current;
    const slider = sliderRef.current;
    if (!track || !slider) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let dir = 1;
    const speed = 0.6;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (pausedRef.current) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      let nl = track.scrollLeft + speed * dir;
      if (nl >= max) {
        nl = max;
        dir = -1;
      } else if (nl <= 0) {
        nl = 0;
        dir = 1;
      }
      track.scrollLeft = nl;
    };

    const onEnter = () => pauseAuto(0);
    const onLeave = () => {
      pausedRef.current = false;
    };
    const onVisibility = () => {
      pausedRef.current = document.hidden;
    };

    slider.addEventListener('pointerenter', onEnter);
    slider.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      slider.removeEventListener('pointerenter', onEnter);
      slider.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // pointer drag
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let startX = 0;
    let startL = 0;

    const onDown = (e: PointerEvent) => {
      down = true;
      movedRef.current = false;
      startX = e.clientX;
      startL = track.scrollLeft;
      track.classList.add('cursor-grabbing');
      pauseAuto(0);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) movedRef.current = true;
      track.scrollLeft = startL - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      track.classList.remove('cursor-grabbing');
      pauseAuto(1500);
    };

    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const onSlideClick = (e: React.MouseEvent) => {
    if (movedRef.current) e.preventDefault();
  };

  return (
    <section
      id="projects"
      className="section--dark relative bg-ink py-[clamp(72px,11vh,150px)] pt-[clamp(56px,8vh,110px)] text-white"
    >
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal as="h2" i={1} className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2">
            {t('titleBefore')}{' '}
            <span className="mark whitespace-nowrap">{t('titleMark')}</span>
            <br />
            {t('titleAfter')}
          </Reveal>
          <Reveal
            as="p"
            i={2}
            className="lede col-span-12 md:col-span-4 md:col-start-9 md:row-start-3"
          >
            {content['projects.lede'] || t('lede')}
          </Reveal>
        </header>

        <Reveal
          i={1}
          className="relative"
        >
          <div
            ref={sliderRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={t('ariaCarousel')}
          >
            <div className="mb-[26px] flex items-center justify-between gap-5">
              <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                {t('hint')}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label={t('prevAria')}
                  disabled={atStart}
                  onClick={() => advance(-1)}
                  className="flex h-[54px] w-[54px] items-center justify-center border border-hair-d transition-colors duration-200 ease-ease hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:border-hair-d disabled:bg-transparent disabled:opacity-30 sm:h-[54px] sm:w-[54px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  aria-label={t('nextAria')}
                  disabled={atEnd}
                  onClick={() => advance(1)}
                  className="flex h-[54px] w-[54px] items-center justify-center border border-hair-d transition-colors duration-200 ease-ease hover:border-brand hover:bg-brand disabled:cursor-not-allowed disabled:border-hair-d disabled:bg-transparent disabled:opacity-30"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div
              ref={trackRef}
              onScroll={update}
              className="no-scrollbar flex cursor-grab gap-6 overflow-x-auto overflow-y-hidden pb-[2px] [overscroll-behavior-x:contain] [scroll-snap-type:x_proximity]"
            >
              {slides.map((slide, idx) => (
                <a
                  key={idx}
                  data-slide
                  href="#contact"
                  onClick={onSlideClick}
                  className={`group relative block flex-none overflow-hidden bg-[#0d0d0d] [scroll-snap-align:start] [user-select:none] ${ratioClass[slide.ratio]} h-[clamp(380px,56vh,580px)]`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 80vw, 40vw"
                    draggable={false}
                    className="pointer-events-none object-cover [filter:grayscale(1)_contrast(1.06)] transition-[filter,transform] duration-700 ease-ease group-hover:scale-[1.05] group-hover:[filter:grayscale(0)_contrast(1.02)]"
                  />
                  <span className="cmark tr !w-6 !h-6 opacity-0 transition-opacity duration-300 ease-ease group-hover:opacity-100" />
                  <span className="cmark bl !w-6 !h-6 opacity-0 transition-opacity duration-300 ease-ease group-hover:opacity-100" />
                  <div className="slide-grad absolute inset-0 z-[1]" />
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-[26px_28px] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-mono">
                      <span className="red-dot" />
                      {slide.loc}
                    </div>
                    <div className="mt-2 font-body text-[14px] font-light text-white/80">
                      {slide.sys}
                    </div>
                  </div>
                </a>
              ))}

              {projects.length === 0 && placeholders.map((ph, idx) => (
                <div
                  key={`ph-${idx}`}
                  data-slide
                  className={`relative flex-none overflow-hidden bg-[#0d0d0d] [scroll-snap-align:start] ${ratioClass[ph.ratio]} h-[clamp(380px,56vh,580px)]`}
                >
                  <div className="ph-stripes absolute inset-0">
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.22em] text-white/30">
                      {ph.label}
                    </div>
                  </div>
                  <span className="cmark tr !w-6 !h-6" />
                  <span className="cmark bl !w-6 !h-6" />
                  <div className="slide-grad absolute inset-0 z-[1]" />
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-[26px_28px] text-white">
                    <div className="flex items-center gap-[9px] font-mono text-[11px] uppercase tracking-mono">
                      <span className="red-dot" />
                      {ph.loc}
                    </div>
                    <div className="mt-2 font-body text-[14px] font-light text-white/80">
                      {ph.sys}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-[26px] h-[2px] bg-hair-d">
              <i
                className="absolute left-0 top-[-1px] block h-[4px] bg-brand transition-[width] duration-200 ease-ease"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
