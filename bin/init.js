#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { select } = require('@inquirer/prompts');

const CSS = `@theme {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-secondary: #8b5cf6;
  --color-secondary-hover: #7c3aed;
  --color-tertiary: #ec4899;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-surface: #f8fafc;
  --color-surface-hover: #f1f5f9;
  --color-border: #e2e8f0;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f0abfc;
  --color-accent-foreground: #701a75;
  --color-destructive: #ef4444;
  --color-destructive-hover: #dc2626;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  --radius: 0.5rem;
  --font: 'Inter', system-ui, -apple-system, sans-serif;
}

.dark {
  --color-primary: #818cf8;
  --color-primary-hover: #6366f1;
  --color-secondary: #a78bfa;
  --color-secondary-hover: #8b5cf6;
  --color-tertiary: #f472b6;
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-border: #334155;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-accent: #c084fc;
  --color-accent-foreground: #f5d0fe;
  --color-destructive: #f87171;
  --color-destructive-hover: #ef4444;
  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-info: #60a5fa;
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
  fs.writeFileSync(file, CSS, 'utf8');
  console.log(`Created ${path.relative(cwd, file)}`);
  return true;
}

function injectImport(cssFile, themeFile) {
  const themeImport = `@import "./${path.basename(themeFile)}";`;
  const sourceImport = `@source "../node_modules/flxtheme";`;

  let content = fs.readFileSync(cssFile, 'utf8');

  const tailwindRegex = /@import\s+["']tailwindcss["'];?/;

  if (!tailwindRegex.test(content)) {
    content = `@import "tailwindcss";\n${sourceImport}\n${themeImport}\n\n${content}`;
  } else {
    content = content.replace(tailwindRegex, (match) => {
      let lines = [match];

      if (!content.includes(sourceImport)) {
        lines.push(sourceImport);
      }

      if (!content.includes(themeImport)) {
        lines.push(themeImport);
      }

      return lines.join('\n');
    });
  }

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

    const themeFile = path.join(path.dirname(cssFile), 'flxtheme.css');

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