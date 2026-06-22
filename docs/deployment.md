# Deployment

This project deploys as a Next.js App Router app on Vercel with Supabase as the
database, auth, and storage backend.

## 1. Preflight

Run from `eurocomfort/`:

```bash
npm ci
npm run content:validate
npm run typecheck
npm run build
```

The production build should show the public routes as SSG with a `1h`
revalidation window:

```txt
● /[locale]                  Revalidate 1h
● /[locale]/catalog/[slug]   Revalidate 1h
```

Admin routes and `/api/lead` should remain dynamic.

## 2. Environment Variables

Set these in Vercel for both Preview and Production environments:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
RESEND_API_KEY
RESEND_FROM
RESEND_TO
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in browser code or
commit it to the repository.

## 3. Supabase Migration

Apply all pending migrations to the target Supabase project before deploying the
app:

```bash
supabase db push
```

If the Supabase CLI is not linked on the deployment machine, apply
`supabase/migrations/0002_category_content.sql` through the Supabase SQL editor.

Then seed the category page content into `categories.content` against the same
target Supabase project:

```bash
node --env-file=.env.local --experimental-strip-types scripts/seed-category-content.ts
```

Make sure `.env.local` points at the target project before running the seed.
The seed is idempotent: it updates existing category rows by `slug` and does not
create categories.

## 4. Deploy With Git Integration

Preferred flow:

```bash
git push origin <branch>
```

Vercel creates a Preview deployment for the branch. Check the preview URL, then
merge into the production branch configured in Vercel.

## 5. Manual Vercel CLI Deploy

Use this when deploying without Git integration:

```bash
npm install -g vercel
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

For preview deployments, omit `--prod`:

```bash
vercel pull --yes --environment=preview
vercel build
vercel deploy --prebuilt
```

## 6. Smoke Check

After deploy, verify:

- `/` and `/ru` load the localized landing page.
- `/catalog/panoramic-glazing` and `/ru/catalog/panoramic-glazing` load.
- Old `/catalog/panoramic-glazing.html` URLs redirect to the new route.
- `/admin/login` loads and an admin can sign in.
- Updating category content in admin refreshes the public catalog page via
  `revalidatePath`.
- Lead form submission writes a lead and sends configured notifications.

## 7. Rollback

Rollback from the Vercel dashboard, or with the CLI:

```bash
vercel rollback
```

If a rollback crosses a database migration boundary, check whether the old app
version expects the previous schema before rolling back the application.
