#!/usr/bin/env node
/**
 * Cross-platform preview runner. Works in PowerShell, cmd, bash, and after launch.
 * Opens the locally hosted preview in the browser when the server is ready.
 * Usage: node scripts/run-preview.js [website|app]
 * Or from repo root: npm run start:website | npm run start:app
 */
const { spawn } = require('child_process');
const path = require('path');
const { platform } = require('os');

const projectRoot = path.resolve(__dirname, '..');
const target = (process.argv[2] || '').toLowerCase();

const configs = {
  website: {
    cwd: path.join(projectRoot, 'website'),
    script: 'dev:new',
    url: 'http://localhost:4000',
    label: 'Website',
  },
  app: {
    cwd: path.join(projectRoot, 'app', 'apps', 'app'),
    script: 'dev:new',
    url: 'http://localhost:4001',
    label: 'App',
  },
};

const config = configs[target];
if (!config) {
  console.error('Usage: node scripts/run-preview.js <website|app>');
  console.error('  website  → http://localhost:4000');
  console.error('  app      → http://localhost:4001');
  process.exit(1);
}

function openBrowser(url) {
  const cmd = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore' }).unref();
}

const OPEN_DELAY_MS = 4000;

const child = spawn('npm', ['run', config.script], {
  cwd: config.cwd,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' },
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

const openTimer = setTimeout(() => openBrowser(config.url), OPEN_DELAY_MS);

child.on('exit', (code) => {
  clearTimeout(openTimer);
  process.exit(code ?? 0);
});

console.log(`\n${config.label} preview: ${config.url}`);
console.log(`Browser will open in ${OPEN_DELAY_MS / 1000}s, or open the URL yourself.\n`);
