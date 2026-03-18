# Deployment (Netlify x2 + Neon)

This repo deploys as **two Netlify sites** (same repo) plus **one Neon Postgres** database shared by both.

## Sites

| Site | Netlify Base directory | Netlify config | What it is |
|------|-------------------------|----------------|------------|
| **Website** | `website/site` | `website/site/netlify.toml` | Next.js marketing site + API routes |
| **App** | `website/app` | `website/app/netlify.toml` | Vite SPA + Netlify Functions |

## Critical Netlify rule

- The **Website** site must have **Publish directory empty**. `@netlify/plugin-nextjs` manages outputs and will fail if publish == repo root.

## Environment variables

Set these in **both** Netlify sites:

- `DATABASE_URL`: Neon connection string (Postgres). Example: `postgresql://...?...sslmode=require`

Set these in the **Website** Netlify site:

- `NEXT_PUBLIC_SITE_URL`: canonical website URL
- `NEXT_PUBLIC_APP_URL`: app’s Netlify URL (used by `/app` page)
- Optional store/APK overrides:
  - `NEXT_PUBLIC_APP_STORE_URL`
  - `NEXT_PUBLIC_PLAY_STORE_URL`
  - `NEXT_PUBLIC_DIRECT_APK_URL` (if you host APK elsewhere)

## Netlify setup (Website site)

1. Create a new Netlify site from this repo.
2. **Base directory**: `website/site`
3. **Build command**: `npm run build`
4. **Publish directory**: **blank**
5. Set env var **`NETLIFY_CONFIG` = `website/site/netlify.toml`** (so Netlify reads the website config from the nested folder).

Health checks after deploy:

- DB: `/api/db/health`
- Orders endpoint: `/api/orders`

## Netlify setup (App site)

1. Create a second Netlify site from this repo.
2. **Base directory**: `website/app`
3. Set env var **`NETLIFY_CONFIG` = `website/app/netlify.toml`**.
4. Build/publish/functions are defined in `website/app/netlify.toml`.

Health check after deploy:

- DB function: `/.netlify/functions/db-health`

## APK + “Get the app” flow

- Put the APK at `website/site/public/downloads/the-joint.apk` (or run `npm run copy-apk -- <path>` from `website/site/`)
- The button downloads from `/api/download-app`
- The PWA fallback is served from `/order` only if you build and copy the app into the website (optional)

