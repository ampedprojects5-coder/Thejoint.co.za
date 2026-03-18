#!/usr/bin/env node
/**
 * Simple local preview server. Serves preview.html and opens the browser.
 * Usage: node scripts/serve-preview.js   or   npm run preview
 * KEEP THIS TERMINAL OPEN or the page will stop loading.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { platform } = require('os');

const root = path.resolve(__dirname, '..');
const PORTS = [3999, 3998, 3997];

function openBrowser(url) {
  const cmd = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore' }).unref();
}

const handler = (req, res) => {
  const file = path.join(root, req.url === '/' ? 'preview.html' : path.basename(req.url));
  const safe = path.normalize(file).startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile();
  const toServe = safe ? file : path.join(root, 'preview.html');
  res.setHeader('Content-Type', 'text/html');
  fs.createReadStream(toServe).pipe(res);
};

function tryPort(i) {
  if (i >= PORTS.length) {
    console.error('\n  Ports ' + PORTS.join(', ') + ' are in use. Close other apps or try again.\n');
    process.exit(1);
  }
  const port = PORTS[i];
  const server = http.createServer(handler);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') return tryPort(i + 1);
    throw err;
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n  ========================================');
    console.log('  The Joint — preview');
    console.log('  ' + url);
    console.log('  KEEP THIS WINDOW OPEN or the page will stop working.');
    console.log('  ========================================\n');
    openBrowser(url);
  });
}

tryPort(0);
