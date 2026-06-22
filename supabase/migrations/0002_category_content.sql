-- Phase 2 — block-based localized page content for catalog categories.
-- Stores the full CategoryContentSchema document (hero + ordered sections),
-- seeded from src/content/categories/*.json. See ADR 0001.

alter table public.categories
  add column if not exists content jsonb not null default '{}'::jsonb;

comment on column public.categories.content is
  'Block-based localized category page content (CategoryContentSchema: hero + sections[]). Seeded from src/content/categories/*.json; empty {} means "use the JSON file fallback".';
