# Контент сторінок категорій

Джерело правди для сторінок `/[locale]/catalog/[slug]` (Phase 0 міграції — див.
[ADR 0001](../../../docs/adr/0001-category-pages-content-architecture.md)).

Кожен файл `{slug}.json` — повний локалізований контент однієї категорії,
валідований Zod-схемою `CategoryContentSchema` з
[`src/lib/categoryContent.ts`](../../lib/categoryContent.ts).

## Структура

- `hero` — шапка сторінки (фон, заголовок, опис, чипи, CTA).
- `sections[]` — впорядкований масив секцій. **Порядок рендера задається тут**
  (напр. у `facade-glazing` порядок `anatomy → variants → specs`, у решти —
  `anatomy → specs → variants`).

Типи секцій (discriminated union по `type`):
`about` · `anatomy` · `specs` · `variants` · `faq`.

> `facade-glazing` має секцію «Типи систем» — це той самий блок `variants`
> з іншим `eyebrow`/`title`, окремий тип не потрібен.

## Локалізація

Кожен текст — пара `{ "uk": "…", "ru": "…" }`. У рантаймі `unwrapContent`
(там само) розгортає під поточну локаль. Рядки можуть містити інлайн-токени
`<red>…</red>` (брендовий акцент) і `<b>…</b>` (жирний) — рендеряться безпечно
через `<RichText>` без `dangerouslySetInnerHTML`.

## Межа «контент vs артворк»

Тут зберігається **весь користувацький текст**. Технічні SVG-креслення
(розрізи вузлів `anatomy`, схеми вузлів `variants`) — це **артворк**: у Phase 1
вони стають per-category SVG-компонентами, які адресуються через
`anatomy.diagram` (`panoramic|facade|sliding|custom`) і `variant.schematic`.
Підписи цих креслень (`tags`, `parts`, `schematic.caption/dim`) лишаються тут і
перекладаються — компонент читає їх із цього JSON.

Іконки в `about.points[].icon` — семантичні ключі (`hidden-mount`, …) → SVG-мапа
в Phase 1.

## Валідація

```bash
npm run content:validate
```

Перевіряє кожен JSON проти схеми та збіг `slug` з іменем файла. Запускайте після
будь-якої правки контенту. У Phase 2 ці ж файли стануть seed для
`categories.content jsonb` у Supabase.
