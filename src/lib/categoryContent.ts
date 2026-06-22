import { z } from 'zod';
import type { Locale } from '@/i18n/routing';

/**
 * Контент сторінок категорій (Phase 0).
 *
 * Джерело правди — JSON-файли `src/content/categories/{slug}.json` з парами
 * `{ uk, ru }` для кожного тексту. Надалі (Phase 2) ці ж дані переїдуть у
 * Supabase (`categories.content jsonb`), а файл лишиться seed/fallback.
 *
 * Межа «контент vs артворк»:
 *  - Увесь користувацький ТЕКСТ (заголовки, інтро, специфікації, варіанти, FAQ,
 *    легенди анатомії) зберігається тут і перекладається.
 *  - Самі технічні SVG-креслення (геометрія розрізів, схем вузлів) — це артворк.
 *    У Phase 1 вони стають per-category SVG-компонентами, які адресуються через
 *    `anatomy.diagram` / `variant.schematic` і отримують свої підписи з цього JSON.
 *
 * Рядкове форматування: підтримуються інлайн-токени `<red>…</red>` (брендовий
 * акцент) і `<b>…</b>` (жирний) — обидва рендеряться безпечно через <RichText>
 * (без dangerouslySetInnerHTML).
 */

const L = z.object({ uk: z.string(), ru: z.string() });
export type Localized = z.infer<typeof L>;

/* ── hero ─────────────────────────────────────────────────────────────── */
const HeroSchema = z.object({
  index: z.string(), // "01 / PANORAMIC-GLAZING" — нелокалізований
  image: z.string(),
  imageAlt: L,
  title: L,
  desc: L,
  chips: z.array(L),
  ctaLabel: L,
});

/* ── about ────────────────────────────────────────────────────────────── */
const AboutPointSchema = z.object({
  icon: z.string(), // семантичний ключ → SVG в Phase 1 (icon map)
  title: L,
});
const AboutSchema = z.object({
  type: z.literal('about'),
  eyebrow: L,
  title: L, // може містити <red>
  intro: z.array(L), // абзаци, можуть містити <b>
  points: z.array(AboutPointSchema),
  apps: z.object({ label: L, value: L }),
});

/* ── anatomy ──────────────────────────────────────────────────────────── */
const AnatomyPartSchema = z.object({
  idx: z.string(),
  label: L,
  sub: L.optional(),
});
const AnatomyNoteSchema = z.object({
  idx: z.string(),
  label: L,
  text: L,
});
const AnatomySchema = z.object({
  type: z.literal('anatomy'),
  eyebrow: L,
  title: L,
  lede: L,
  diagram: z.string(), // id bespoke SVG-компонента: panoramic | facade | sliding | custom
  tags: z.object({ left: L, right: L }).optional(),
  parts: z.array(AnatomyPartSchema),
  notes: z.array(AnatomyNoteSchema),
});

/* ── specs ────────────────────────────────────────────────────────────── */
const SpecRowSchema = z.object({
  k: L,
  v: L,
  small: L.optional(), // вторинна частина значення (<small>)
});
const SpecsSchema = z.object({
  type: z.literal('specs'),
  eyebrow: L,
  title: L,
  columns: z.array(z.array(SpecRowSchema)), // зазвичай 2 колонки
  note: L.optional(),
});

/* ── variants (facade: «systems») ─────────────────────────────────────── */
const VariantItemSchema = z.object({
  idx: z.string(),
  name: L, // у списку-перемикачі
  spec: L, // короткий підпис у списку
  image: z.string(),
  imageAlt: L,
  captionN: L, // "Варіант 01" / "Тип 01" / "Родина 01"
  title: L,
  description: L,
  schematic: z.object({ caption: L, dim: L }), // підписи bespoke SVG-схеми вузла
});
const VariantsSchema = z.object({
  type: z.literal('variants'),
  eyebrow: L,
  title: L,
  lede: L,
  planLabel: L, // підпис над схемою (vconf__plan)
  ctaLabel: L,
  items: z.array(VariantItemSchema),
});

/* ── faq ──────────────────────────────────────────────────────────────── */
const FaqItemSchema = z.object({ q: L, a: L });
const CategoryFaqSchema = z.object({
  type: z.literal('faq'),
  eyebrow: L,
  title: L, // може містити <red>
  items: z.array(FaqItemSchema),
});

/* ── section union + page ─────────────────────────────────────────────── */
const SectionSchema = z.discriminatedUnion('type', [
  AboutSchema,
  AnatomySchema,
  SpecsSchema,
  VariantsSchema,
  CategoryFaqSchema,
]);

export const CategoryContentSchema = z.object({
  slug: z.string(),
  hero: HeroSchema,
  sections: z.array(SectionSchema), // порядок рендера задається тут
});

export type CategoryContent = z.infer<typeof CategoryContentSchema>;
export type CategorySection = z.infer<typeof SectionSchema>;
export type AboutSection = z.infer<typeof AboutSchema>;
export type AnatomySection = z.infer<typeof AnatomySchema>;
export type SpecsSection = z.infer<typeof SpecsSchema>;
export type VariantsSection = z.infer<typeof VariantsSchema>;
export type CategoryFaqSection = z.infer<typeof CategoryFaqSchema>;

/**
 * Рекурсивно «розгортає» всі `{ uk, ru }` у рядок під поточну локаль.
 * Тип результату — той самий, але з `string` замість `Localized`.
 */
export type Unwrapped<T> = T extends Localized
  ? string
  : T extends Array<infer U>
    ? Array<Unwrapped<U>>
    : T extends object
      ? { [K in keyof T]: Unwrapped<T[K]> }
      : T;

function isLocalized(v: unknown): v is Localized {
  return (
    typeof v === 'object' &&
    v !== null &&
    'uk' in v &&
    'ru' in v &&
    typeof (v as Record<string, unknown>).uk === 'string'
  );
}

export function unwrapContent<T>(value: T, locale: Locale): Unwrapped<T> {
  if (isLocalized(value)) {
    return (value[locale] || value.uk) as Unwrapped<T>;
  }
  if (Array.isArray(value)) {
    return value.map((item) => unwrapContent(item, locale)) as Unwrapped<T>;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, unwrapContent(v, locale)])
    ) as Unwrapped<T>;
  }
  return value as Unwrapped<T>;
}

export type LocalizedCategoryContent = Unwrapped<CategoryContent>;

// Розгорнуті (string замість Localized) типи для пропсів компонентів секцій.
export type LHero = LocalizedCategoryContent['hero'];
export type LSection = Unwrapped<CategorySection>;
export type LAbout = Unwrapped<AboutSection>;
export type LAnatomy = Unwrapped<AnatomySection>;
export type LSpecs = Unwrapped<SpecsSection>;
export type LVariants = Unwrapped<VariantsSection>;
export type LFaq = Unwrapped<CategoryFaqSection>;
