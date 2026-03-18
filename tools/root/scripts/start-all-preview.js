#!/usr/bin/env node
/**
 * Start full local preview: hub + website + application.
 * Opens website and app (in new windows on Windows, background on Unix), then runs the hub and opens browser.
 * Usage: node scripts/start-all-preview.js  or  npm run start:preview
 */
const path = require('path');
const { spawn } = require('child_process');
const { platform } = require('os');

const projectRoot = path.resolve(__dirname, '..');

function startWebsiteAndApp() {
  if (platform() === 'win32') {
    spawn('cmd', ['/c', 'start', '"The Joint - Website (4000)"', 'cmd', '/k', 'cd /d "' + projectRoot + '" && npm run start:website'], { stdio: 'ignore', shell: true }).unref();
    spawn('cmd', ['/c', 'start', '"The Joint - App (4001)"', 'cmd', '/k', 'cd /d "' + projectRoot + '" && npm run start:app'], { stdio: 'ignore', shell: true }).unref();
  } else {
    spawn('npm', ['run', 'start:website'], { cwd: projectRoot, stdio: 'ignore', detached: true }).unref();
    spawn('npm', ['run', 'start:app'], { cwd: projectRoot, stdio: 'ignore', detached: true }).unref();
  }
}

console.log('\n  Starting Website and App... This window runs the preview hub. Keep it open.\n');
startWebsiteAndApp();
process.env.PREVIEW_HUB_OPEN_DELAY = '6000';
require('./serve-preview-hub.js');
