# Start the app (local preview)

**If you see "Can't reach this page" or ERR_CONNECTION_REFUSED:** the app isn't running. Start it with one of the methods below and **keep that terminal window open**. Only then open **http://localhost:4001** in your browser.

---

Use **one** of these. All use **http://localhost:4001** (not 4000).

## Easiest — from repo root

```bash
npm run start:app
```

Or:

```bash
npm run app
```

If dependencies are missing, the script will run `npm install` in the app workspace first.

---

## Windows — double-click or Command Prompt

1. Open the repo folder **The Joint** in File Explorer.
2. Double-click **start-app.bat**.

Or from Command Prompt (repo root):

```cmd
start-app.bat
```

---

## If that fails — run by hand

Open a terminal at the **repo root** (the folder that contains `app`, `website`, `scripts`).

**Step 1 — install (once):**

```bash
cd app
npm install
```

**Step 2 — start the app:**

```bash
cd apps\app
npm run dev:new
```

Then open **http://localhost:4001** in your browser.

---

## Diagnose app failures

From the **repo root** run:

```bash
npm run diagnose:app
```

This checks app structure, config, dependencies, and **runs a full production build**. Fix any reported errors, then try `npm run start:app` again.

---

## "Can't reach this page" or ERR_CONNECTION_REFUSED

Start the app first: run `npm run start:app` from repo root and leave the terminal open. Wait until you see `Local: http://localhost:4001`, then open **http://localhost:4001** in the browser. If you see errors in the terminal, run `cd app` then `npm install` and try again.

---

## Port already in use?

If you see “port 4001 is already in use”:

- Close the other app or terminal using that port, or
- Edit `app/apps/app/package.json`: change `dev:new` to use another port, e.g. `npx vite --port 4002 --host --open`, then open http://localhost:4002.
