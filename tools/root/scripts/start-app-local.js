#!/usr/bin/env node
/**
 * Start the order app locally (port 4001). Run from repo root.
 * Installs dependencies in the app workspace if needed, then starts Vite.
 * Waits for the server to respond before opening the browser.
 * Usage: node scripts/start-app-local.js
 *    or: npm run start:app
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { platform } = require('os');

const projectRoot = path.resolve(__dirname, '..');
const appDir = path.join(projectRoot, 'app');
const appAppDir = path.join(appDir, 'apps', 'app');
const appPackageJson = path.join(appAppDir, 'package.json');
const appNodeModules = path.join(appAppDir, 'node_modules');
const appRootNodeModules = path.join(appDir, 'node_modules');
const APP_BASE = 'http://localhost:4001';
const APP_URL = APP_BASE;
const APP_PORT = 4001;
/** Optional: "owner" | "both". Default opens customer URL only. */
const PREVIEW_MODE = process.argv[2] || '';
const WAIT_MAX_MS = 90000;
const WAIT_INTERVAL_MS = 800;

function openBrowser(url) {
  const cmd = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore' }).unref();
}

function urlsToOpen() {
  if (PREVIEW_MODE === 'owner') return [APP_BASE + '?preview=owner'];
  if (PREVIEW_MODE === 'both') return [APP_BASE, APP_BASE + '?preview=owner'];
  return [APP_BASE];
}

function waitForServer() {
  return new Promise((resolve) => {
    const start = Date.now();
    function tryOnce() {
      const req = http.get(APP_URL, (res) => {
        res.on('data', () => {});
        res.on('end', () => resolve(true));
      });
      req.on('error', () => {
        if (Date.now() - start > WAIT_MAX_MS) {
          resolve(false);
          return;
        }
        setTimeout(tryOnce, WAIT_INTERVAL_MS);
      });
      req.setTimeout(2000, () => {
        req.destroy();
        if (Date.now() - start > WAIT_MAX_MS) resolve(false);
        else setTimeout(tryOnce, WAIT_INTERVAL_MS);
      });
    }
    tryOnce();
  });
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

console.log('\n  The Joint — starting app (local preview)');
console.log('  KEEP THIS TERMINAL OPEN. When you see "Local: http://localhost:4001", open that URL in your browser.\n');

if (!exists(appPackageJson)) {
  console.error('  ERROR: App folder not found.');
  console.error('  Expected: app/apps/app/package.json');
  console.error('  From repo root, run: node scripts/start-app-local.js\n');
  process.exit(1);
}

const hasLocalNodeModules = exists(appNodeModules);
const hasWorkspaceNodeModules = exists(appRootNodeModules);

if (!hasLocalNodeModules && !hasWorkspaceNodeModules) {
  console.log('  Installing dependencies (app workspace)...');
  const install = spawn('npm', ['install'], {
    cwd: appDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  install.on('error', (err) => {
    console.error('  ERROR: npm install failed.', err.message);
    process.exit(1);
  });
  install.on('exit', (code) => {
    if (code !== 0) {
      console.error('\n  Fix: From repo root run:  cd app  then  npm install\n');
      process.exit(code);
    }
    startVite();
  });
} else {
  startVite();
}

function startVite() {
  console.log('  App URL:', APP_BASE, PREVIEW_MODE ? '(preview: ' + PREVIEW_MODE + ')' : '');
  console.log('  Waiting for the server to be ready, then opening the browser...');
  console.log('  (Look for "Local: http://localhost:4001" in the output below.)\n');

  const child = spawn('npm', ['run', 'dev:new'], {
    cwd: appAppDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  let opened = false;
  const urls = urlsToOpen();
  const waitThenOpen = () => {
    waitForServer().then((ok) => {
      if (ok && !opened) {
        opened = true;
        console.log('\n  Server is ready. Opening', urls.length > 1 ? urls.length + ' tabs' : urls[0], '\n');
        urls.forEach((url, i) => setTimeout(() => openBrowser(url), i * 600));
      }
    });
  };
  setTimeout(waitThenOpen, 2000);

  child.on('error', (err) => {
    console.error('\n  ERROR: Could not start the app.');
    console.error('  ', err.message);
    printConnectionRefusedHelp();
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0 && !opened) {
      console.error('\n  Server exited before starting. If you see "connection refused" in the browser:');
      printConnectionRefusedHelp();
    }
    process.exit(code ?? 0);
  });
}

function printConnectionRefusedHelp() {
  console.error('\n  Connection refused? Try:');
  console.error('    1. Run from repo root:  npm run start:app');
  console.error('    2. Install deps first:  cd app  then  npm install');
  console.error('    3. Start by hand:        cd app\\apps\\app  then  npm run dev:new');
  console.error('    4. If port 4001 is in use, close that app or change port in app/apps/app/package.json (dev:new script)\n');
}
