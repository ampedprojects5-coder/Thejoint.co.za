#!/usr/bin/env node
/**
 * Deep inspection of the app: structure, config, dependencies, and build.
 * Run from repo root: node scripts/diagnose-app.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const appDir = path.join(repoRoot, 'app', 'apps', 'app');
const errors = [];
const warnings = [];

function check(name, fn) {
  try {
    const result = fn();
    if (result === false) errors.push(name);
    else if (typeof result === 'string') warnings.push(`${name}: ${result}`);
    return result !== false;
  } catch (e) {
    errors.push(`${name}: ${e.message}`);
    return false;
  }
}

console.log('\n--- The Joint app — diagnostic ---\n');

check('App directory exists', () => fs.existsSync(appDir));
check('package.json exists', () => fs.existsSync(path.join(appDir, 'package.json')));
check('src/main.tsx exists', () => fs.existsSync(path.join(appDir, 'src', 'main.tsx')));
check('index.html exists', () => fs.existsSync(path.join(appDir, 'index.html')));
check('vite.config.ts exists', () => fs.existsSync(path.join(appDir, 'vite.config.ts')));
check('tsconfig.json exists', () => fs.existsSync(path.join(appDir, 'tsconfig.json')));

const pkgPath = path.join(appDir, 'package.json');
let pkg;
check('package.json is valid JSON', () => {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return true;
});

if (pkg) {
  check('Has vite dependency', () => !!(pkg.devDependencies && pkg.devDependencies.vite) || !!(pkg.dependencies && pkg.dependencies.vite));
  check('Has react dependency', () => !!(pkg.dependencies && pkg.dependencies.react));
  check('Has dev:new script', () => !!(pkg.scripts && pkg.scripts['dev:new']));
  check('Has build script', () => !!(pkg.scripts && pkg.scripts.build));
}

const appNodeModules = path.join(appDir, 'node_modules');
const workspaceNodeModules = path.join(repoRoot, 'app', 'node_modules');
check('node_modules present (app or workspace)', () =>
  fs.existsSync(appNodeModules) || fs.existsSync(workspaceNodeModules)
);
if (!fs.existsSync(appNodeModules) && !fs.existsSync(workspaceNodeModules)) {
  warnings.push('Run: cd app && npm install');
}

check('Shared package resolvable', () => {
  const nm = fs.existsSync(appNodeModules) ? appNodeModules : workspaceNodeModules;
  const shared = path.join(nm, '@the-joint', 'shared');
  if (fs.existsSync(shared)) return true;
  const wpkgPath = path.join(repoRoot, 'app', 'package.json');
  if (fs.existsSync(wpkgPath)) {
    const wpkg = JSON.parse(fs.readFileSync(wpkgPath, 'utf-8'));
    if (wpkg.workspaces) return 'Workspace root may need npm install';
  }
  return false;
});

check('AuthContext exists', () => fs.existsSync(path.join(appDir, 'src', 'context', 'AuthContext.tsx')));
check('AgeVerificationContext exists', () => fs.existsSync(path.join(appDir, 'src', 'context', 'AgeVerificationContext.tsx')));
check('ErrorBoundary exists', () => fs.existsSync(path.join(appDir, 'src', 'components', 'ErrorBoundary.tsx')));
check('index.html has #root', () => {
  const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf-8');
  return html.includes('id="root"') || html.includes("id='root'");
});
check('index.html loads main.tsx', () => {
  const html = fs.readFileSync(path.join(appDir, 'index.html'), 'utf-8');
  return html.includes('main.tsx');
});

console.log('Build check (vite build)...');
try {
  execSync('npm run build', { cwd: appDir, stdio: 'pipe', timeout: 60000 });
  console.log('  Build: OK\n');
} catch (e) {
  errors.push('Build failed');
  if (e.stderr) console.error(e.stderr.toString());
  if (e.stdout) console.error(e.stdout.toString());
  console.log('');
}

console.log('--- Summary ---\n');
if (errors.length) {
  console.log('Errors:');
  errors.forEach((e) => console.log('  ✗', e));
  console.log('');
}
if (warnings.length) {
  console.log('Warnings:');
  warnings.forEach((w) => console.log('  ⚠', w));
  console.log('');
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('All checks passed. Start app: npm run start:app');
} else if (errors.length === 0) {
  console.log('No blocking errors. Address warnings if the app fails.');
} else {
  console.log('Fix the errors above. Then: npm run start:app');
  process.exit(1);
}
console.log('');
