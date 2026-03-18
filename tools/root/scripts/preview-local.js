#!/usr/bin/env node
/**
 * New locally hosted preview: hub + website + app.
 * Serves the hub from preview-local/, starts website and app, opens the hub in the browser.
 * Usage: node scripts/preview-local.js   or   npm run preview:local
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { platform } = require('os');

const projectRoot = path.resolve(__dirname, '..');
const hubDir = path.join(projectRoot, 'preview-local');
const HUB_PORTS = [3996, 3995, 3994];

function openBrowser(url) {
  const cmd = platform() === 'win32' ? 'start' : platform() === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { shell: true, stdio: 'ignore' }).unref();
}

function startWebsiteAndApp() {
  if (platform() === 'win32') {
    spawn('cmd', ['/c', 'start', '"The Joint - Website (4000)"', 'cmd', '/k', 'cd /d "' + projectRoot + '" && npm run start:website'], { stdio: 'ignore', shell: true }).unref();
    spawn('cmd', ['/c', 'start', '"The Joint - App (4001)"', 'cmd', '/k', 'cd /d "' + projectRoot + '" && npm run start:app'], { stdio: 'ignore', shell: true }).unref();
  } else {
    spawn('npm', ['run', 'start:website'], { cwd: projectRoot, stdio: 'ignore', detached: true }).unref();
    spawn('npm', ['run', 'start:app'], { cwd: projectRoot, stdio: 'ignore', detached: true }).unref();
  }
}

function createHandler() {
  return (req, res) => {
    const file = req.url === '/' || req.url === '' ? 'index.html' : path.basename(req.url.replace(/^\//, ''));
    const safePath = path.join(hubDir, file);
    const valid = path.normalize(safePath).startsWith(hubDir) && fs.existsSync(safePath) && fs.statSync(safePath).isFile();
    const pathToServe = valid ? safePath : path.join(hubDir, 'index.html');
    const ext = path.extname(pathToServe);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.ico': 'image/x-icon' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    fs.createReadStream(pathToServe).pipe(res);
  };
}

function tryListen(portIndex) {
  if (portIndex >= HUB_PORTS.length) {
    console.error('\n  Ports', HUB_PORTS.join(', '), 'are in use. Stop other previews or try again.\n');
    process.exit(1);
  }
  const port = HUB_PORTS[portIndex];
  const server = http.createServer(createHandler());
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') return tryListen(portIndex + 1);
    throw err;
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log('\n  The Joint — local preview');
    console.log('  Hub:  ' + url);
    console.log('  Site: http://localhost:4000  |  App: http://localhost:4001');
    console.log('  Keep this window open. Browser will open the hub.\n');
    startWebsiteAndApp();
    setTimeout(() => openBrowser(url), 2500);
  });
}

tryListen(0);
