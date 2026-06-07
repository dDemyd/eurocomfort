import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal';
import type { Category, LocalizedRecord } from '@/lib/queries';

type Tile = {
  tn: string;
  title: string;
  meta: string;
  alt: string;
  image: string;
};

function MarkedTitle({ value, fallbackBefore, fallbackMark }: { value?: string; fallbackBefore: string; fallbackMark: string }) {
  if (!value) return <>{fallbackBefore} <span className="mark">{fallbackMark}</span></>;
  const parts = value.trim().split(/\s+/);
  const mark = parts.pop();
  return <>{parts.join(' ')} {mark ? <span className="mark">{mark}</span> : null}</>;
}

export default function Categories({
  categories = [],
  content = {},
}: {
  categories?: Category[];
  content?: LocalizedRecord;
}) {
  const t = useTranslations('categories');
  const fallbackTiles = t.raw('tiles') as Tile[];
  const tiles =
    categories.length > 0
      ? categories.map((category, index) => ({
          tn: `${String(index + 1).padStart(2, '0')} / ${category.slug}`,
          title: category.title,
          meta: fallbackTiles[index]?.meta ?? '',
          alt: category.title,
          image: category.image || fallbackTiles[index]?.image || '/assets/facade.webp',
        }))
      : fallbackTiles;

  return (
    <section
      id="catalog"
      className="section--dark relative bg-ink py-[clamp(72px,11vh,150px)] text-white"
    >
      <div className="wrap">
        <header className="mb-[clamp(40px,6vh,84px)] grid grid-cols-12 items-start gap-x-6 gap-y-[18px] md:gap-y-[22px]">
          <Reveal as="p" i={0} className="col-span-12 md:col-span-3 md:col-start-1 md:row-start-1 eyebrow">
            {t('eyebrow')}
          </Reveal>
          <Reveal
            as="h2"
            i={1}
            className="display-title col-span-12 md:col-span-8 md:col-start-1 md:row-start-2"
          >
            <MarkedTitle
              value={content['catalog.title']}
              fallbackBefore={t('titleBefore')}
              fallbackMark={t('titleMark')}
            />
          </Reveal>
          <Reveal
            as="p"
            i={2}
            className="lede col-span-12 md:col-span-4 md:col-start-9 md:row-start-3"
          >
            {content['catalog.lede'] || t('lede')}
          </Reveal>
        </header>

        <div className="grid grid-cols-1 gap-px border border-hair-d bg-hair-d sm:grid-cols-2">
          {tiles.map((tile, idx) => (
            <Reveal
              key={tile.title}
              i={idx % 2}
              as="div"
              className="group relative block overflow-hidden bg-[#0d0d0d] aspect-[4/3] sm:aspect-[16/10]"
            >
              <a href="#contact" className="absolute inset-0 block">
                <div className="absolute inset-0">
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover [filter:grayscale(1)_contrast(1.05)] transition-[filter,transform] duration-700 ease-ease group-hover:scale-[1.04] group-hover:[filter:grayscale(0)_contrast(1.02)]"
                  />
                </div>
                <span className="cmark tr !w-[26px] !h-[26px] opacity-0 transition-opacity duration-300 ease-ease group-hover:opacity-100" />
                <span className="cmark bl !w-[26px] !h-[26px] opacity-0 transition-opacity duration-300 ease-ease group-hover:opacity-100" />
                <div className="tile-grad absolute inset-0 z-[1]" />
                <div className="absolute inset-x-0 bottom-0 z-[2] p-[30px_32px] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
                  <div className="mb-3 flex items-center gap-[9px] font-mono text-[11px] tracking-[0.18em]">
                    <span className="red-dot inline-flex items-center" />
                    <span>{tile.tn}</span>
                  </div>
                  <h3 className="font-display font-extrabold uppercase leading-[0.98] tracking-tighter2 text-[clamp(1.5rem,2.4vw,2.4rem)]">
                    {tile.title}
                  </h3>
                  <div className="mt-[14px] flex translate-y-[8px] items-center gap-[10px] font-mono text-[11px] tracking-[0.14em] text-white/80 opacity-0 transition-all duration-300 ease-ease group-hover:translate-y-0 group-hover:opacity-100">
                    <span>{tile.meta}</span>
                    <span className="text-brand">→</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
