#!/usr/bin/env node
/**
 * Pre-publish check: fail if any source contains "lorem" or "ipsum".
 * Lorem ipsum is for development purposes only and must be removed before publishing.
 *
 * Run from repo root: node scripts/check-no-lorem.js
 * Exits 0 if clean, 1 if matches found.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIRS = [
  path.join(ROOT, 'app', 'apps', 'app', 'src'),
  path.join(ROOT, 'app', 'packages', 'shared', 'src'),
  path.join(ROOT, 'website', 'src'),
];
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json'];
const PATTERN = /\b(lorem|ipsum)\b/i;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== 'dist' && e.name !== '.git') {
      walk(full, files);
    } else if (e.isFile() && EXTS.some((ext) => e.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

let hadMatch = false;
for (const dir of DIRS) {
  const files = walk(dir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (PATTERN.test(line)) {
        hadMatch = true;
        const rel = path.relative(ROOT, file);
        console.error(`[check-no-lorem] ${rel}:${i + 1}: lorem/ipsum found (development-only; remove before publishing)`);
        console.error(`  ${line.trim().slice(0, 80)}${line.length > 80 ? '…' : ''}`);
      }
    });
  }
}

if (hadMatch) {
  console.error('\nLorem ipsum is for development only. Remove all occurrences before publishing.');
  process.exit(1);
}
console.log('check-no-lorem: no lorem/ipsum in source (OK for publish).');
process.exit(0);
