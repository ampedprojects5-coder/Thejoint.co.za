# Managing The Joint — Website & App

Everything you need to run, deploy, and operate the **website** and **order app**. Use this as the single reference for day-to-day management.

---

## 1. Project structure

| What | Where | Purpose |
|------|--------|---------|
| **Website** | `website/` | Next.js 14 marketing site: home, age gate, app download, about, locations, FAQ, contact, progress, image lab |
| **Order app** | `app/apps/app/` | Vite + React: menu, cart, checkout, orders, tracking, dashboard, rewards, mod page |
| **Shared** | `app/packages/shared/` | Types & constants (strains, zones, currency R) used by the app |
| **Scripts** | `scripts/` | Start website, app, full preview, diagnose |

**Ports (local):**

| Service | URL | Port |
|---------|-----|------|
| Website | http://localhost:4000 | 4000 |
| Order app | http://localhost:4001 | 4001 |
| Preview hub | http://localhost:3999 | 3999 |

---

## 2. Running locally

**From repo root** (folder that contains `app`, `website`, `scripts`). Use **PowerShell**, **cmd**, or **bash**. Do not chain `cd x && npm run y` in PowerShell — run one command per terminal if needed.

### Start the website only

```bash
npm run start:website
```

Opens http://localhost:4000 after a few seconds. First time: `cd website` then `npm install` if prompted.

### Start the order app only

```bash
npm run start:app
```

Or: `npm run app`. Installs deps in `app` if needed, starts the app, then opens http://localhost:4001. **Keep the terminal open.**

### Start both (website + app) for full preview

**Option A — New local preview (recommended)**  
From repo root: **`npm run preview:local`**. Or double‑click **`preview-local.bat`** (Windows). Starts the hub (http://localhost:3996), website (4000), and app (4001), then opens the hub in your browser. Keep this terminal (and the two extra windows on Windows) open.

**Option B — Original one-click (Windows)**  
Double‑click **`start-all-preview.bat`**. Two extra windows (website + app); this window runs the hub (port 3999).

**Option C — From repo root**

```bash
npm run start:preview
```

Same as Option B: starts website and app (new windows on Windows), then runs the hub.

**Option C — Two terminals**

- Terminal 1: `npm run start:website` → http://localhost:4000  
- Terminal 2: `npm run start:app`   → http://localhost:4001  

### Make orders sync to the website (local)

1. Open the **order app**: http://localhost:4001  
2. Sign in as **shop owner**.  
3. Go to **Dashboard** → **App appearance**.  
4. Set **Web companion URL** to `http://localhost:4000` (no trailing slash). Save.  
5. Place an order as a customer.  
6. Open http://localhost:4000/progress — the order appears there (list refreshes every 20s; use **Refresh** to update now).

### Owner login (default credentials)

The app seeds a **single owner account** when no users exist. Use it to access the **Dashboard** and **POS** (POS is owner-only; staff and vendors do not see or use it).

| Purpose | Value |
|---------|--------|
| **Email** | `owner@thejoint.local` |
| **Password** | `OwnerTheJoint24!` |

**First time:** Open the app → **Login** → enter the credentials above. Then change the password in **Profile** or **Settings** for production. Only the owner account can open the **POS** mini-app; all other accounts (staff, vendors, customers) are not allowed to deploy or use POS.

### POS (owner only)

The **POS** mini-app is available only to the **owner** (shop_owner). It is not shown to staff, vendors, or customers. From the owner’s account: open the app → **POS** in the nav (or go to `/pos`). Use it for quick in-store sales (products + shop items, total, complete sale). Staff use **Dashboard → Orders**; vendors use **My deliveries**.

### Other useful commands

| Command | Description |
|---------|-------------|
| `npm run new:website` | Start website on 4000 (alternative to start:website) |
| `npm run new:app` | Start app on 4001 from repo root |
| `npm run preview:hub` | Run only the preview hub (3999); start website & app separately |
| `npm run diagnose:app` | Check app structure, deps, and run a production build |

**Windows:** You can also double‑click **`start-app.bat`** to start only the app, or **`open-preview-hub.bat`** to open the hub HTML without a server (then start website and app in two terminals).

---

## 3. Environment variables

### Website (`website/`)

Copy `website/.env.example` to `website/.env.local` and set as needed.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical, sitemap). Required for production. |
| `NEXT_PUBLIC_APP_STORE_URL` | iOS App Store link (after publishing). |
| `NEXT_PUBLIC_PLAY_STORE_URL` | Google Play link (after publishing). |
| `NEXT_PUBLIC_DIRECT_APK_URL` | Optional. Direct APK URL; otherwise site serves `public/downloads/the-joint.apk`. |
| `CONTACT_EMAIL` | Where contact form submissions are sent (with Resend). |
| `RESEND_API_KEY` | Resend API key for contact form email. |
| `RESEND_FROM` | From address, e.g. `The Joint <noreply@yourdomain.com>`. |

Without Resend vars, contact form submissions are logged only.

### Order app (`app/apps/app/`)

- **No .env required for basic run.**  
- **Web companion URL** is set **in the app** (Dashboard → App appearance) and stored in the browser (localStorage key `tj_web_companion_base`). After deploy, set it to your live website URL so orders sync to `/progress`.

---

## 4. Deployment

### Website

- **Source:** `website/`  
- **Build:** `cd website && npm install && npm run build`.  
- **Host:** e.g. Vercel — set **Root Directory** to `website`, add env vars from `website/.env.example`.  
- **Note:** On serverless (e.g. Vercel), writes to `data/` (orders, app-config) may not persist; use a DB or external store for production.

### Order app

- **Source:** `app/apps/app/` (monorepo: install from `app/` so `@the-joint/shared` is available).  
- **Build:** `cd app && npm install && cd apps/app && npm run build`. Output: `app/apps/app/dist`.  
- **Host:** e.g. Vercel or Netlify. Vercel: Root = `app`, Install = `npm install`, Build = `npm run build` (from `apps/app`), Publish = `apps/app/dist`. Add **SPA rewrite**: `/(.*)` → `/index.html` (status 200). Or root = repo root, Build = `cd app && npm install && cd apps/app && npm run build`, Output = `app/apps/app/dist`.  
- **After deploy:** In the app (Settings or Dashboard as shop owner), set **Companion website URL** to your live website URL so orders sync.

Detailed steps: **app/DEPLOY.md** (paths there refer to `apps/web` / `apps/app` inside the monorepo; your live setup uses root `website/` and `app/apps/app/` as above).

---

## 5. Post-deploy checklist

- [ ] **Website:** Set `NEXT_PUBLIC_SITE_URL` to your live site URL.  
- [ ] **Website:** Set `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_PLAY_STORE_URL` after publishing the mobile app.  
- [ ] **Website:** Optional: configure Resend (`CONTACT_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM`) for contact form.  
- [ ] **Order app:** In the app (Dashboard → App appearance), set **Web companion URL** to your live website URL.  
- [ ] **APK:** Place `the-joint.apk` in `website/public/downloads/` or set `NEXT_PUBLIC_DIRECT_APK_URL`. See **website/APP-DOWNLOAD.md** for full flow.

---

## 6. Day-to-day management

### Viewing orders (owner)

- **Local:** http://localhost:4000/progress  
- **Production:** `https://your-website-domain/progress`  
Orders are those synced from the order app when **Web companion URL** is set. List auto-refreshes; use **Refresh** to update.

### App appearance (splash, product images)

- **In app:** Dashboard (shop owner) → **App appearance** — set Web companion URL, optionally use **Sync from web** to pull splash from the website.  
- **On website:** `/tools/image-lab` — set splash background and product images; the app can pull this config via the companion API.

### Contact form

- Submissions go to `POST /api/contact`. With Resend configured, emails go to `CONTACT_EMAIL`. Without, they are logged only.  
- Contact page: `/contact`.

### Store links and APK (app downloadable from the website)

- The app is **downloadable from the website** at **/app**: visitors get the Android APK, App Store link (when set), and Google Play link (when set).  
- **To enable APK download:** Place `the-joint.apk` in `website/public/downloads/` (see `website/public/downloads/README.md`), or set `NEXT_PUBLIC_DIRECT_APK_URL` to an external URL.  
- Set `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_PLAY_STORE_URL` after publishing.  
- **Full flow (build → deploy → Play):** **website/APP-DOWNLOAD.md**.

### Auth and data (current setup)

- **App auth:** Local only (login/register in localStorage); no real backend.  
- **Orders:** Stored locally in the app and synced to the website’s `/api/orders` (stored in `data/orders-sync.json` when writable).  
- For production you’ll want a real order backend and auth (e.g. Supabase, Firebase). See **app/STATUS.md** for “Not done / to decide”.

---

## 7. Troubleshooting

| Problem | What to do |
|--------|------------|
| **“Can’t reach this page” / ERR_CONNECTION_REFUSED** | Start the app first: `npm run start:app` from repo root; keep the terminal open. Wait for “Local: http://localhost:4001” then open that URL. |
| **Port already in use** | Close the other app using the port, or change the port in `app/apps/app/package.json` (e.g. `dev:new` to `--port 4002`) and use http://localhost:4002. |
| **Website won’t start** | From repo root: `cd website && npm install && npm run dev:new` (or the port in `website/package.json`). |
| **App won’t start or build** | From repo root: `npm run diagnose:app`. Fix any errors, then `npm run start:app`. If deps are missing: `cd app && npm install`. |
| **Orders not showing on /progress** | In the order app (as shop owner), set **Web companion URL** (Dashboard → App appearance) to the website URL (e.g. http://localhost:4000 or your live URL). Place an order and refresh /progress. |

---

## 8. Quick reference — scripts (repo root)

| Script | Description |
|--------|-------------|
| `npm run start:website` | Start website (4000), open browser |
| `npm run start:app` / `npm run app` | Start order app (4001), install if needed, open browser |
| `npm run preview:local` | **New** local preview: hub (3996) + website + app; opens browser |
| `npm run start:preview` | Start website + app + preview hub (Windows: new windows) |
| `npm run new:website` | Start website on 4000 |
| `npm run new:app` | Start app on 4001 |
| `npm run preview:hub` | Start only preview hub (3999) |
| `npm run diagnose:app` | Check app and run production build |

---

## 9. Before publishing

- **Lorem ipsum / placeholder content:** Any lorem ipsum or development-only placeholder text must be removed before publishing. Run **`npm run check:publish`** from repo root to fail the build if `lorem` or `ipsum` appears in app or website source. Fix or remove any matches before release.

---

## 10. Where to read more

| Topic | File |
|-------|------|
| High-level overview | **README.md** |
| What’s done vs not done | **app/STATUS.md** |
| Development (contact, mobile, scripts) | **app/DEVELOPMENT.md** |
| Deploy steps (website + app) | **app/DEPLOY.md** |
| Starting the app only | **START-APP.md** |
| Local preview (website + app + hub) | **PREVIEW.md** |
| Website features and API | **website/README.md** |
| App download and APK flow | **website/APP-DOWNLOAD.md** |

You now have everything in one place to manage The Joint website and application. Use **MANAGE.md** as your main entry point; link to the docs above for deeper detail.

---

**Development-only content:** Lorem ipsum and similar placeholders are for development purposes only and must be removed upon publishing. Use `npm run check:publish` before release.
