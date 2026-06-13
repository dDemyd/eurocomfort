import type { Locale } from '@/i18n/routing';

type CatalogPage = {
  slug: string;
  href: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const catalogPages: CatalogPage[] = [
  {
    slug: 'panoramic-glazing',
    href: '/catalog/panoramic-glazing',
    label: {
      uk: 'Панорамне скління',
      ru: 'Панорамное остекление',
    },
    description: {
      uk: 'Безрамні системи від підлоги до стелі',
      ru: 'Безрамные системы от пола до потолка',
    },
  },
  {
    slug: 'facade-glazing',
    href: '/catalog/facade-glazing',
    label: {
      uk: 'Фасадне скління',
      ru: 'Фасадное остекление',
    },
    description: {
      uk: 'Структурні та вентильовані фасади',
      ru: 'Структурные и вентилируемые фасады',
    },
  },
  {
    slug: 'sliding-systems',
    href: '/catalog/sliding-systems',
    label: {
      uk: 'Розсувні системи',
      ru: 'Раздвижные системы',
    },
    description: {
      uk: 'Lift & Slide з мінімальними рамами',
      ru: 'Lift & Slide с минимальными рамами',
    },
  },
  {
    slug: 'custom-forms',
    href: '/catalog/custom-forms',
    label: {
      uk: 'Нестандартні форми',
      ru: 'Нестандартные формы',
    },
    description: {
      uk: 'Криволінійні та нетипові конструкції',
      ru: 'Криволинейные и нетиповые конструкции',
    },
  },
];

export function getCatalogPages(locale: string) {
  const lang: Locale = locale === 'ru' ? 'ru' : 'uk';
  const prefix = lang === 'ru' ? '/ru' : '';

  return catalogPages.map((page, index) => ({
    ...page,
    href: `${prefix}${page.href}`,
    index: String(index + 1).padStart(2, '0'),
    label: page.label[lang],
    description: page.description[lang],
  }));
}

export function getCatalogHrefByIndex(index: number, locale = 'uk') {
  const prefix = locale === 'ru' ? '/ru' : '';

  return catalogPages[index] ? `${prefix}${catalogPages[index].href}` : '#catalog';
}
