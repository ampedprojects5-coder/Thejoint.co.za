# The Joint — Cannabis Dispensary

**The Joint** is a cannabis dispensary project with a marketing **website** and an **order app**.

**Managing everything (run, deploy, env, daily ops):** see **[MANAGE.md](MANAGE.md)**.

**Deployment (Netlify x2 + Neon):** see **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)**.

## Project structure

| Folder    | Purpose |
|----------|---------|
| **website** | Next.js 14 marketing site: **top nav only (no sidebar)**, header with Home, Get app, About, Locations, FAQ, Contact; mobile dropdown menu. Age gate (21+), footer, loading states. Optimized build (SWC, framer-motion). |
| **app**     | Monorepo: **order app** (Vite + React), **web**, **mobile**, **shared**. Order app: **The Joint** branding (logo fallback, title/meta), **Error Boundary**, password auth, confirm modals, memoized list components, order sync to website. Splash shows “The Joint” clearly. |

## Quick start (run from repo root)

Works in **PowerShell, cmd, and bash**. Do not use `cd x && npm run y` in PowerShell — use the commands below.

### Website (marketing + companion)

From repo root:

```bash
npm run new:website
```

Then open **http://localhost:4000**. Or use the cross-platform runner: `npm run start:website`.

First time: `cd website` then `npm install`. See `website/README.md` for env and deploy.

### Order app (menu, cart, checkout)

From repo root (recommended — installs deps if needed, waits for server, then opens browser):

```bash
npm run start:app
```

Or: `npm run app`. Then open **http://localhost:4001**.

First time: `cd app` then `npm install`. Set the **Web companion URL** in the app (Dashboard → App appearance) to `http://localhost:4000` so orders sync to the website's `/progress` page.

**App startup & integrations:** For step-by-step startup (including Windows `start-app.bat`), connection troubleshooting, and running website + app together, see **[START-APP.md](START-APP.md)** and **[PREVIEW.md](PREVIEW.md)**. To check app structure and run a production build: `npm run diagnose:app`.

### Mobile app (Expo)

```bash
cd app
npm run dev:mobile
```

Use Expo Go to test. See `app/README.md` and `app/DEVELOPMENT.md` for EAS build and store submission.

## Features

- **Website**: Age gate (21+), app download CTAs (APK + store links), contact form, order progress view, image lab for app assets. Full app-download and Google Play flow: see `website/APP-DOWNLOAD.md`.
- **Order app**: Auth (local), age verification, menu (with optional product images), cart, checkout, orders & tracking, rewards, shop owner dashboard, mod page. Responsive layout and touch-friendly nav (bottom bar on mobile, sidebar on desktop).
- **Shared**: Types and constants (strains, zones, currency R) in `app/packages/shared`.

## Compliance

Use in line with local cannabis regulations (age verification, delivery boundaries, advertising).
