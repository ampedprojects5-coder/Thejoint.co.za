# Local preview — The Joint

Two previews: **Website** (4000) and **App** (4001).

## Preview hub

The hub is a small page with two links: **Website** and **App**.

**Double-click `start-all-preview.bat`** (Windows) in the repo root. It opens:

- **Two extra windows**: one runs the **website** (localhost:4000), one runs the **application** (localhost:4001). Keep both open.
- **This window**: runs the **preview hub** and opens your browser to it. The hub is a locally hosted page with links to the **Website** and the **Application**.

Or from a terminal at repo root: **`npm run start:preview`** (same behavior; on Windows the website and app open in new windows).

## Preview hub (links to both)

**No server needed:** Double-click **`open-preview-hub.bat`** in the repo root. It opens the hub page from a file (no localhost). Then start the website and app in two terminals (see below) so the hub links work.

**Or run the hub as a local server:** From repo root, `npm run preview:hub` → opens **http://localhost:3999** (or 3998/3997 if 3999 is in use). Keep that terminal open. Start the website and app in two other terminals so the hub links work.

## Quick start (recommended — from repo root)

**Terminal 1 — Website**
```bash
npm run start:website
```
→ **http://localhost:4000**

**Terminal 2 — Order app**
```bash
npm run start:app
```
or
```bash
npm run app
```
→ **http://localhost:4001** — the script installs dependencies if needed, starts the app, and opens your browser.

**Can’t start the app?** See **[START-APP.md](START-APP.md)** for step-by-step options (including **start-app.bat** on Windows).

The **app preview** is now visible from the website: on the download page (/app) you’ll see **“Try the app in your browser”** and an **“Open app preview”** button; when you scroll on any page, the sticky bar shows an **“App preview”** link. Both open the order app in a new tab.

Then make the app preview **fully functional** (orders sync to website):

1. Open the **order app** at http://localhost:4001.
2. Sign in as **shop owner**.
3. Go to **Dashboard** → **App appearance**.
4. Set **Web companion URL** to `http://localhost:4000` (no trailing slash). Click **Save**.
5. Place an order as a customer (or switch to a customer account and place an order).
6. Open **http://localhost:4000/progress** — the order appears there. The list auto-refreshes every 20s; use **Refresh** to update now.
7. Optionally: use **Sync from web** in Dashboard to pull the splash background from the website Image lab.

## Other URLs (legacy ports)

| Project   | URL (root scripts)   | Alternative (cd into folder)      |
|-----------|----------------------|-----------------------------------|
| Website   | http://localhost:4000 | `cd website` → `npm run dev` → 3002 |
| Order app | http://localhost:4001 | `cd app` → `npm run dev:app` → 5175 |

If you use **website on 3002** and **app on 5175**, set Web companion URL to `http://localhost:3002` so orders sync to the correct site.

## Stop preview

Stop the dev servers with `Ctrl+C` in each terminal.
