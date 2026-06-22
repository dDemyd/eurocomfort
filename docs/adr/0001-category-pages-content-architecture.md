# ADR 0001 — Архітектура сторінок категорій: контент у JSON → базі

- **Статус:** Запропоновано
- **Дата:** 2026-06-22
- **Контекст автор:** аналіз `app/[locale]/catalog/[slug]`

## Контекст

Сторінки категорій (`panoramic-glazing`, `facade-glazing`, `sliding-systems`,
`custom-forms`) зараз побудовані принципово інакше, ніж лендинг, і це створює
технічний борг та функціональні баги.

### Що зараз

```
public/catalog/*.html (4 × ~47KB, lang="uk")
        │  fs.readFileSync на кожен запит
        ▼
lib/categoryDesign.ts — regex вирізає <main>, ріже по id="projects"/"contact",
        │  sanitize(): replaceAll для підміни посилань + хардкод-костиль
        │  .replace(/style="height: 807px"/)
        ▼
page.tsx — dangerouslySetInnerHTML × 3 куски
        │  між ними живі <Projects/> та <LeadForm/>
        ▼
CategoryInteractions.tsx — querySelectorAll + addEventListener
        вручну навішує reveal / табы вариантов / FAQ-аккордеон
```

### Проблеми

1. **Зламана локалізація (критично).** HTML — лише `lang="uk"`. На `/ru/catalog/*`
   весь основний контент (about-system, anatomy, specs, variants, faq) показується
   українською. Перекладені лише динамічні React-частини.
2. **Крихкий парсинг.** Regex по `<main>` і різання по `</section>` ламається від
   будь-якої правки розмітки — мовчки. Є хардкод-костиль на `height: 807px`.
3. **`dangerouslySetInnerHTML` + імперативний DOM.** Обходить React: немає
   типобезпеки, інтерактив навішується ззовні по класах (jQuery-стиль у React 19),
   XSS-поверхня на ручному HTML.
4. **Дублювання / мертвий код.** `public/category.css` (304 рядки) та
   `public/styles.css` дублюють `src/styles/category-*.css`; `<head>`/`<script>`
   усередині HTML-файлів не використовуються (інжектиться лише `<main>`).
5. **`force-dynamic` + читання файлу з диска на кожен запит** для статичного
   контенту; `generateStaticParams` знебмолюється.

### Ключове спостереження

**Правильний патерн вже існує в проєкті — на лендингу.** Його треба не вигадувати,
а поширити на категорії:

| Потреба | Готовий примітив | Файл |
|---|---|---|
| Scroll-reveal без global DOM | `<Reveal>` (IntersectionObserver) | `components/Reveal.tsx` |
| Rich text + fallback | `<RichText>` | `components/RichText.tsx` |
| FAQ-аккордеон на `useState` | `<Faq>` | `components/sections/Faq.tsx` |
| Тексти JSON → БД | next-intl `messages/*.json` + Supabase `jsonb {uk,ru}` | `messages/`, `lib/queries.ts` |

БД уже зберігає **весь** локалізований текст як `jsonb {uk, ru}`
(`categories.title`, `content_blocks.value`, …). Вимога «тексти в JSON → базі» —
це чинний патерн, а не новий механізм.

## Рішення

Привести категорії до тієї ж data-driven моделі, що й лендинг: **структурований
контент (блоки) → типізований JSON → Supabase `jsonb` → React Server Components**.

### 1. Модель контенту: блоки (block-based content)

Кожна категорія — впорядкований масив типізованих секцій. Discriminated union.

```ts
// src/lib/categoryContent.ts
type Localized = { uk: string; ru: string };
type Para = Localized;                       // абзац; body = Para[]

export type CategorySection =
  | { type: 'about';   eyebrow: Localized; title: Localized; body: Para[];
      stats?: { value: string; label: Localized }[] }
  | { type: 'anatomy'; title: Localized; image: string;
      hotspots: { id: string; label: Localized; description: Localized;
                  x: number; y: number }[] }                 // %-координати, без height:807px
  | { type: 'specs';   title: Localized; rows: { label: Localized; value: Localized }[] }
  | { type: 'variants';title: Localized;
      items: { id: string; name: Localized; description: Localized; image: string }[] }
  | { type: 'faq';     title: Localized; items: { question: Localized; answer: Localized }[] };

export type CategoryContent = {
  slug: string;
  label: Localized;
  description: Localized;
  hero?: { title: Localized; subtitle: Localized; image: string };
  sections: CategorySection[];               // порядок рендера задається тут
};
```

- Валідація: **Zod**-схема `CategoryContentSchema`. Перевіряє і JSON-файли, і
  payload з адмінки перед записом у БД.
- `facade-glazing` має `systems` замість `variants` — це той самий блок `variants`
  з іншим `title`. Окремий тип не потрібен.
- `projects` / `contact` / `others` лишаються живими React-секціями
  (`<Projects>`, `<LeadForm>`, `<CategoryRail>`) — їх з контенту НЕ виносимо.

### 2. Зберігання: JSON-файли → колонка `categories.content jsonb`

**Source of truth (репо):** `src/content/categories/{slug}.json` — повний
`CategoryContent` з `uk`+`ru`. Це «тексти в JSON-документах».

**База:** додати колонку до наявної таблиці (узгоджено з рештою схеми):

```sql
-- supabase/migrations/0002_category_content.sql
alter table public.categories
  add column if not exists content jsonb not null default '{}'::jsonb;
```

Сід: JSON-файли → `seed.sql` / скрипт `scripts/seed-category-content.ts`
(upsert по `slug`). Адмінка редагує `categories.content`.

> **Чому одна `jsonb`-колонка, а не нормалізовані таблиці на тип блоку.**
> Контент — ієрархічний, локалізований, з порядком; читається завжди цілком на
> одну сторінку; редагується однією формою. Нормалізація (таблиці
> `category_sections`, `section_specs`, …) дала б 5+ JOIN заради даних, що завжди
> ходять разом, і ускладнила б збереження порядку/локалі. `jsonb` точно
> повторює наявний підхід (`title jsonb`, `content_blocks.value jsonb`).
> Trade-off: немає FK-цілісності всередині блоків — компенсуємо Zod на запис.

### 3. Рендеринг: RSC + реєстр блоків

```tsx
// components/category/CategorySections.tsx  (server)
const REGISTRY = {
  about:   AboutSection,
  anatomy: AnatomySection,
  specs:   SpecsSection,
  variants:VariantsSection,
  faq:     CategoryFaqSection,
} as const;

export default function CategorySections({ sections }: { sections: CategorySection[] }) {
  return <>{sections.map((s, i) => {
    const C = REGISTRY[s.type];
    return <C key={`${s.type}-${i}`} {...(s as any)} />;
  })}</>;
}
```

- Секції-обгортки використовують `<Reveal>` / `<RichText>` і ті самі класи
  (`.wrap`, `.eyebrow`, `.display-title`), що лендинг → візуально нічого не
  ламається, CSS уже є (`category-design.css`).
- Інтерактив — маленькі **клієнтські** компоненти зі `state`, БЕЗ global DOM:
  - `VariantsSection` → `useState(activeId)` замість `[data-variants]/.vrow`.
  - `CategoryFaqSection` → **перевикористати** `<Faq>` (вже на `useState`).
  - `AnatomySection` → `<AnatomyHotspots>` (`useState(activeHotspot)`).
- **Видаляємо повністю:** `CategoryInteractions.tsx`, `categoryDesign.ts`, усі
  `dangerouslySetInnerHTML`, regex-парсинг, `sanitize()`.

### 4. Дані → сторінка (з fallback, як у `<Faq>`)

```ts
// lib/queries.ts
export async function getCategoryContent(locale: Locale, slug: string)
  : Promise<CategoryContent> {
  const db = await safeQuery(null, async () => { /* select content from categories where slug */ });
  const raw = db ?? (await import(`@/content/categories/${slug}.json`)).default; // file = fallback/seed
  return unwrapContent(CategoryContentSchema.parse(raw), locale);  // {uk,ru} → string по locale
}
```

`unwrapContent` рекурсивно застосовує наявний `unwrap(value, locale)` до всіх
`Localized`-полів. Файл = надійний fallback, коли БД порожня/недоступна (точно як
`dbItems.length ? db : t.raw('items')` у `Faq.tsx`).

### 5. Перформанс і чистка

- Прибрати `export const dynamic = 'force-dynamic'` зі сторінки категорії →
  `export const revalidate = 3600` + працюючий `generateStaticParams`. Контент
  рідко змінюється; адмінка робить `revalidatePath('/catalog/[slug]')` після
  збереження.
- Видалити після міграції: `public/catalog/*.html`, `public/category.css`,
  `public/styles.css`, `lib/categoryDesign.ts`, `components/category/CategoryInteractions.tsx`.

## План міграції (фази)

| Фаза | Зміст | Результат |
|---|---|---|
| **0. Витяг контенту** | Розпарсити 4 HTML → `src/content/categories/*.json` з `uk`+`ru` (ru перекласти — зараз його нема). + Zod-схема, типи. | Джерело правди в JSON, типобезпека. |
| **1. React-секції** | `CategorySections` + 5 секцій-компонентів (reveal/richtext/state). `page.tsx` рендерить з JSON замість inject. | Прибрано HTML-inject, виправлено `/ru`, видалено `CategoryInteractions`/`categoryDesign`. |
| **2. БД + адмінка** | Міграція `0002`, сід JSON→`categories.content`, `getCategoryContent` читає БД (файл=fallback). Форма редагування в `admin/(panel)/categories/[id]`. | Контент редагується без деплою. |
| **3. Чистка + перф** | Видалити мертві HTML/CSS, зняти `force-dynamic`, увімкнути ISR + `revalidatePath`. | Статична генерація, менший репо. |

Фази 0–1 уже дають головну цінність (виправлення локалізації + усунення хаку) і
не залежать від БД. Фази 2–3 можна робити окремими PR.

## Наслідки

**Плюси:** виправлена `ru`-локалізація; типобезпека (TS+Zod); єдиний патерн із
лендингом; інтерактив у React (a11y «з коробки», без global DOM); прибрано XSS на
ручному HTML; статична генерація; мінус ~200KB мертвих ассетів; контент
редагований з адмінки.

**Мінуси / вартість:** разовий ручний витяг контенту з HTML + **переклад на ru**
(найбільший шматок роботи); потрібна Zod (нова залежність); 5 нових компонентів +
1 міграція БД.

**Ризики:** (1) втрата нюансів верстки при витягу — мітигуємо візуальним порівнянням
до/після per-категорія; (2) розбіжність JSON-файл vs БД після фази 2 — файл лишаємо
лише як seed/fallback, єдине джерело для прод-редагування = БД.

## Альтернативи, які відхилено

- **Лишити HTML-inject, лише додати ru-файли** — подвоює мертвий код (8 файлів),
  не прибирає крихкий парсинг та імперативний DOM. Лікує симптом, не причину.
- **MDX на категорію** — добре для тексту, погано для структурованих
  specs/variants/hotspots і для редагування не-розробником через адмінку.
- **Нормалізовані таблиці на кожен тип блоку** — оверкіл (див. trade-off у §2).
- **Headless CMS (Sanity/Contentful)** — зайва інфраструктура; Supabase+jsonb уже
  покриває потребу і вже використовується.
