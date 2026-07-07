#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { select } = require('@inquirer/prompts');

const CSS = `@import "tailwindcss";

@theme {
  --color-flx-primary: #6366f1;
  --color-flx-primary-hover: #4f46e5;
  --color-flx-secondary: #8b5cf6;
  --color-flx-secondary-hover: #7c3aed;
  --color-flx-tertiary: #ec4899;
  --color-flx-background: #ffffff;
  --color-flx-foreground: #0f172a;
  --color-flx-surface: #f8fafc;
  --color-flx-surface-hover: #f1f5f9;
  --color-flx-border: #e2e8f0;
  --color-flx-muted: #f1f5f9;
  --color-flx-muted-foreground: #64748b;
  --color-flx-accent: #f0abfc;
  --color-flx-accent-foreground: #701a75;
  --color-flx-destructive: #ef4444;
  --color-flx-destructive-hover: #dc2626;
  --color-flx-success: #22c55e;
  --color-flx-warning: #f59e0b;
  --color-flx-info: #3b82f6;

  --radius-flx: 0.5rem;
  --font-flx: 'Inter', system-ui, -apple-system, sans-serif;
}

.dark {
  --color-flx-primary: #818cf8;
  --color-flx-primary-hover: #6366f1;
  --color-flx-secondary: #a78bfa;
  --color-flx-secondary-hover: #8b5cf6;
  --color-flx-tertiary: #f472b6;
  --color-flx-background: #0f172a;
  --color-flx-foreground: #f8fafc;
  --color-flx-surface: #1e293b;
  --color-flx-surface-hover: #334155;
  --color-flx-border: #334155;
  --color-flx-muted: #1e293b;
  --color-flx-muted-foreground: #94a3b8;
  --color-flx-accent: #c084fc;
  --color-flx-accent-foreground: #f5d0fe;
  --color-flx-destructive: #f87171;
  --color-flx-destructive-hover: #ef4444;
  --color-flx-success: #4ade80;
  --color-flx-warning: #fbbf24;
  --color-flx-info: #60a5fa;
}
`;

const cwd = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(cwd, file));
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function writeTheme(file) {
  ensureDir(file);

  if (fs.existsSync(file)) {
    console.log(`Skipped: ${path.relative(cwd, file)} already exists.`);
    return false;
  }

  fs.writeFileSync(file, CSS, 'utf8');
  console.log(`Created ${path.relative(cwd, file)}`);
  return true;
}

function injectImport(cssFile, themeFile) {
  const importPath =
    './' + path.basename(themeFile);

  const importLine = `@import "${importPath}";`;

  let content = fs.readFileSync(cssFile, 'utf8');

  if (content.includes(importLine)) {
    console.log(`Import already exists in ${path.relative(cwd, cssFile)}`);
    return;
  }

  content = `${importLine}\n\n${content}`;

  fs.writeFileSync(cssFile, content, 'utf8');

  console.log(`Updated ${path.relative(cwd, cssFile)}`);
}

function findNextCss() {
  const candidates = [
    'app/globals.css',
    'src/app/globals.css',
    'styles/globals.css',
  ];

  for (const file of candidates) {
    if (exists(file)) {
      return path.join(cwd, file);
    }
  }

  return null;
}

function findViteCss() {
  const candidates = [
    'src/index.css',
    'src/main.css',
  ];

  for (const file of candidates) {
    if (exists(file)) {
      return path.join(cwd, file);
    }
  }

  return null;
}

function cssOnly() {
  const target = path.join(cwd, 'src', 'flxtheme.css');
  writeTheme(target);
}

async function run() {
  const framework = await select({
    message: 'Select your project',
    choices: [
      {
        name: 'Next.js',
        value: 'next',
      },
      {
        name: 'Vite',
        value: 'vite',
      },
      {
        name: 'CSS Only',
        value: 'css',
      },
    ],
  });

  if (framework === 'next') {
    const cssFile = findNextCss();

    if (!cssFile) {
      console.log('No Next.js global CSS found.');
      console.log('Falling back to CSS Only.\n');
      cssOnly();
      return;
    }

    const themeFile = path.join(
      path.dirname(cssFile),
      'flxtheme.css'
    );

    writeTheme(themeFile);
    injectImport(cssFile, themeFile);
    return;
  }

  if (framework === 'vite') {
    const cssFile = findViteCss();

    if (!cssFile) {
      console.log('No Vite CSS file found.');
      console.log('Falling back to CSS Only.\n');
      cssOnly();
      return;
    }

    const themeFile = path.join(cwd, 'src', 'flxtheme.css');

    writeTheme(themeFile);
    injectImport(cssFile, themeFile);
    return;
  }

  cssOnly();
}

const cmd = process.argv[2];

if (cmd === 'init') {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  console.log('Usage: npx flxtheme@latest init');
}