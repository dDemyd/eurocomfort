# Euro Comfort

Euro Comfort is a bilingual landing site and admin panel for a Ukrainian premium aluminum and glass systems company. The public site presents services, projects, testimonials, FAQ content, and a lead form. The admin area lets authorized users manage editable landing content, categories, projects, testimonials, FAQ items, settings, media, and incoming leads.

## Tech Stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- next-intl for Ukrainian and Russian localization
- Supabase for Postgres, Auth, Row Level Security, and Storage
- Telegram and Resend integrations for lead notifications
- next/image with AVIF/WebP support and Supabase Storage remote images

## Main Features

- Public bilingual landing page: Ukrainian at `/`, Russian at `/ru`
- SEO metadata, sitemap, robots, canonical URLs, and hreflang alternates
- CMS-backed section content with localized `uk` and `ru` values
- Safe rich text markers for headings: `<red>text</red>` and `<br>`
- Admin panel under `/admin`
- Supabase Auth protected admin routes
- CRUD for projects, categories, testimonials, FAQ, content blocks, and settings
- Lead form with validation, Supabase persistence, Telegram alerts, and optional email delivery via Resend
- Public media bucket for project/category images

## Project Structure

```txt
eurocomfort/
├── messages/              # Static UI translations
│   ├── uk.json
│   └── ru.json
├── public/                # Static assets, favicon, app manifest, images
├── supabase/
│   ├── migrations/        # Database schema and RLS policies
│   └── seed.sql           # Initial content
├── src/
│   ├── app/               # Next.js App Router routes
│   │   ├── [locale]/      # Public localized site
│   │   ├── admin/         # Protected admin area
│   │   └── api/lead/      # Lead submission endpoint
│   ├── components/        # Public sections, admin UI, shared components
│   ├── i18n/              # next-intl routing and request config
│   ├── lib/               # Supabase clients, queries, actions, integrations
│   └── styles/            # Global styles and design tokens
└── next.config.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Fill in the required values in `.env.local`, then start the development server:

```bash
npm run dev
```

The app will be available at:

```txt
http://localhost:3000
```

If port `3000` is busy, Next.js will automatically use another available port.

## Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
RESEND_API_KEY=
RESEND_FROM=
RESEND_TO=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to the browser.
- Telegram variables are used by the lead submission flow.
- Resend variables are used for email lead notifications.
- Plausible is optional and only needed when analytics is enabled.

## Supabase

The database schema, RLS policies, and storage bucket setup live in:

```txt
supabase/migrations/0001_init.sql
```

Seed content lives in:

```txt
supabase/seed.sql
```

The app expects localized content fields to be stored as JSON objects:

```json
{
  "uk": "Ukrainian text",
  "ru": "Russian text"
}
```

To create an admin user:

1. Create a user in Supabase Authentication.
2. Open the `profiles` table.
3. Change that user's `role` from `viewer` to `admin`.

## Available Scripts

```bash
npm run dev        # Start the local development server
npm run build      # Create a production build
npm run start      # Start the production server
npm run lint       # Run Next.js linting
npm run typecheck  # Run TypeScript checks
```

## Deployment

The project is designed for Vercel deployment. Configure the same environment variables in the Vercel project settings, connect Supabase, and deploy the Next.js app from this directory.
