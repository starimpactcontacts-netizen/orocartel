# orocartel.com

Pre-launch site for OROCARTEL: full-bleed hero with a drop countdown, collection tiles, an early-access list (email plus optional Instagram handle and size), a privacy page, OG image, favicon, robots and sitemap.

Standalone Next.js 15 app.

## Deploy on Vercel

1. Vercel → **Add New → Project** → import this repo. Framework: Next.js (auto-detected).
2. Add the environment variables below, then deploy.
3. **Settings → Domains** → add `orocartel.com` (and `www.orocartel.com`, redirecting to the apex).

## Supabase

The `oro_waitlist` table and the `oro_waitlist_count()` function are defined in `supabase/schema.sql`. Signups go through `/api/waitlist` using the publishable key. RLS only allows inserting rows and calling the count function, so nobody can read the list with that key.

To export the list: Supabase → Table Editor → `oro_waitlist` → Export CSV.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | no | Defaults to the orocartel project in `lib/supabase.ts` |
| `SUPABASE_PUBLISHABLE_KEY` | no | Defaults to the orocartel publishable key in `lib/supabase.ts` |
| `NEXT_PUBLIC_DROP_DATE` | no | e.g. `2026-11-14T18:00:00-05:00`. Empty shows "coming soon" |
| `NEXT_PUBLIC_INSTAGRAM_URL` | no | Footer link is hidden when empty |
| `NEXT_PUBLIC_TIKTOK_URL` | no | |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after you change them.

## Editing copy

- Name, tagline, announcement bar, hero photo: `site` in `lib/site.ts`
- Collection tiles (names and photos): `collections` in `lib/site.ts`. Put images in `/public`.
- Trust row (Limited runs / No restocks / Members first): top of `app/page.tsx`

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```
