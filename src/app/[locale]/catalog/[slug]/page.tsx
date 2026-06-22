import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import CategoryBodyClass from '@/components/category/CategoryBodyClass';
import CategoryRail from '@/components/category/CategoryRail';
import CategorySections from '@/components/category/CategorySections';
import CategoryHero from '@/components/category/sections/CategoryHero';
import CategoryFaqSection from '@/components/category/sections/CategoryFaqSection';
import OtherSystemsSection from '@/components/category/sections/OtherSystemsSection';
import SiteHeader from '@/components/SiteHeader';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollSpine from '@/components/ScrollSpine';
import Projects from '@/components/sections/Projects';
import LeadForm from '@/components/sections/LeadForm';
import Footer from '@/components/sections/Footer';
import { catalogPages } from '@/lib/catalogPages';
import { getCategoryContent, getCategoryData } from '@/lib/queries';
import { routing, type Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 3600;

/** slug → ключ bespoke SVG-діаграми */
const SLUG_DIAGRAM: Record<string, string> = {
  'panoramic-glazing': 'panoramic',
  'facade-glazing': 'facade',
  'sliding-systems': 'sliding',
  'custom-forms': 'custom',
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    catalogPages.map((page) => ({ locale, slug: page.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const page = catalogPages.find((item) => item.slug === slug);

  if (!page) return {};

  const title = `${page.label[currentLocale]} — ЄВРО КОМФОРТ`;
  const description = page.description[currentLocale];
  const prefix = currentLocale === 'ru' ? '/ru' : '';

  return {
    title,
    description,
    alternates: {
      canonical: `${prefix}/catalog/${slug}`,
      languages: {
        uk: `/catalog/${slug}`,
        ru: `/ru/catalog/${slug}`,
        'x-default': `/catalog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: currentLocale === 'ru' ? 'ru_UA' : 'uk_UA',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  const currentLocale = routing.locales.includes(locale as Locale) ? (locale as Locale) : routing.defaultLocale;
  const page = catalogPages.find((item) => item.slug === slug);

  if (!page) notFound();

  setRequestLocale(currentLocale);
  const [data, content] = await Promise.all([
    getCategoryData(currentLocale, slug),
    getCategoryContent(currentLocale, slug),
  ]);
  if (!data.category || !content) notFound();

  const faq = content.sections.find((s): s is Extract<typeof s, { type: 'faq' }> => s.type === 'faq');
  const diagram = SLUG_DIAGRAM[slug] ?? 'panoramic';

  const projectContent = {
    ...data.content,
    'projects.title':
      currentLocale === 'ru'
        ? 'Проекты в <span>этой категории</span>'
        : 'Проєкти в <span>цій категорії</span>',
    'projects.lede':
      currentLocale === 'ru'
        ? 'Реальные объекты из базы, привязанные к выбранной категории.'
        : 'Реальні об’єкти з бази, прив’язані до вибраної категорії.',
  };

  return (
    <>
      <CategoryBodyClass />
      <SmoothScroll />
      <ScrollSpine />
      <SiteHeader settings={data.settings} variant="category" />
      <CategoryRail locale={currentLocale} currentSlug={slug} />
      <main id="top" className="cat-content">
        <CategoryHero hero={content.hero} locale={currentLocale} />
        <CategorySections sections={content.sections} locale={currentLocale} diagram={diagram} />
        <Projects projects={data.projects} content={projectContent} />
        {faq ? <CategoryFaqSection section={faq} /> : null}
        <LeadForm settings={data.settings} content={data.content} />
        <OtherSystemsSection locale={currentLocale} currentSlug={slug} />
      </main>
      <Footer categories={data.categories} settings={data.settings} variant="category" />
    </>
  );
}
