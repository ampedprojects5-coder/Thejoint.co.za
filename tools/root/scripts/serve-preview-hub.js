#!/usr/bin/env node
/**
 * Serve the preview hub locally and open it in the browser.
 * Hub page links to website (4000) and app (4001).
 * Usage: node scripts/serve-preview-hub.js
 *    or: npm run preview:hub
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { platform } = require('os');

const projectRoot = path.resolve(__dirname, '..');
const hubDir = path.join(projectRoot, 'preview-hub');
const PORTS_TO_TRY = [3999, 3998, 3997];

function openBrowser(url) {
  const cmd = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore' }).unref();
}

function createHandler() {
  return (req, res) => {
    const safePath = path.join(hubDir, path.basename(req.url.replace(/^\//, '') || 'index.html'));
    const pathToServe = path.normalize(safePath).startsWith(hubDir) && fs.existsSync(safePath) && fs.statSync(safePath).isFile()
      ? safePath
      : path.join(hubDir, 'index.html');
    const ext = path.extname(pathToServe);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.ico': 'image/x-icon' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    fs.createReadStream(pathToServe).pipe(res);
  };
}

function tryListen(portIndex) {
  if (portIndex >= PORTS_TO_TRY.length) {
    console.error('\n  Ports', PORTS_TO_TRY.join(', '), 'are in use. Close other apps or try again.\n');
    process.exit(1);
  }
  const port = PORTS_TO_TRY[portIndex];
  const server = http.createServer(createHandler());
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      tryListen(portIndex + 1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n  The Joint — preview hub');
    console.log('  ' + url);
    console.log('  Keep this terminal open. Use the page to open Website (4000) and App (4001).\n');
    // Delay opening so website/app have time to start when launched together (start-all-preview sets this)
    const delay = process.env.PREVIEW_HUB_OPEN_DELAY ? parseInt(process.env.PREVIEW_HUB_OPEN_DELAY, 10) : 0;
    setTimeout(() => openBrowser(url), delay);
  });
}

tryListen(0);
