# orocartel.com

Pre-launch drop site for ORO CARTEL: hero with a live countdown, an early-access list (email plus optional Instagram handle and size), a locked Drop 001 preview, and privacy, OG image, favicon, robots and sitemap.

Standalone Next.js 15 app.

## Deploy on Vercel

1. Vercel → **Add New → Project** → import this repo. Framework: Next.js (auto-detected).
2. Add the environment variables below, then deploy.
3. **Settings → Domains** → add `orocartel.com` (and `www.orocartel.com`, redirecting to the apex).

## Supabase

Run `supabase/schema.sql` in the SQL editor. You can use a new project or the existing one, since the table is named `oro_waitlist`. Signups go through `/api/waitlist` with the service role key. RLS is on with no policies, so the list can't be read from the browser.

To export the list: Supabase → Table Editor → `oro_waitlist` → Export CSV.

## Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only. Without it, signups return "list is not open yet" |
| `NEXT_PUBLIC_DROP_DATE` | no | e.g. `2026-11-14T18:00:00-05:00`. Empty shows "coming soon" |
| `NEXT_PUBLIC_INSTAGRAM_URL` | no | Footer link is hidden when empty |
| `NEXT_PUBLIC_TIKTOK_URL` | no | |
| `NEXT_PUBLIC_CONTACT_EMAIL` | no | Used in the footer and on the privacy page |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after you change them.

## Editing copy

- Tagline and description: `lib/site.ts`
- Marquee, Drop 001 cards and "How it works": top of `app/page.tsx`

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```
