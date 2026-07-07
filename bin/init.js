#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { select, input } = require('@inquirer/prompts');

function buildCss(prefix) {
  const p = prefix ? `${prefix}-` : '';

  return `@theme {
  --color-${p}primary: #6366f1;
  --color-${p}primary-hover: #4f46e5;
  --color-${p}secondary: #8b5cf6;
  --color-${p}secondary-hover: #7c3aed;
  --color-${p}tertiary: #ec4899;
  --color-${p}background: #ffffff;
  --color-${p}foreground: #0f172a;
  --color-${p}surface: #f8fafc;
  --color-${p}surface-hover: #f1f5f9;
  --color-${p}border: #e2e8f0;
  --color-${p}muted: #f1f5f9;
  --color-${p}muted-foreground: #64748b;
  --color-${p}accent: #f0abfc;
  --color-${p}accent-foreground: #701a75;
  --color-${p}destructive: #ef4444;
  --color-${p}destructive-hover: #dc2626;
  --color-${p}success: #22c55e;
  --color-${p}warning: #f59e0b;
  --color-${p}info: #3b82f6;

  --radius-${p}: 0.5rem;
  --font-${p}: 'Inter', system-ui, -apple-system, sans-serif;
}

.dark {
  --color-${p}primary: #818cf8;
  --color-${p}primary-hover: #6366f1;
  --color-${p}secondary: #a78bfa;
  --color-${p}secondary-hover: #8b5cf6;
  --color-${p}tertiary: #f472b6;
  --color-${p}background: #0f172a;
  --color-${p}foreground: #f8fafc;
  --color-${p}surface: #1e293b;
  --color-${p}surface-hover: #334155;
  --color-${p}border: #334155;
  --color-${p}muted: #1e293b;
  --color-${p}muted-foreground: #94a3b8;
  --color-${p}accent: #c084fc;
  --color-${p}accent-foreground: #f5d0fe;
  --color-${p}destructive: #f87171;
  --color-${p}destructive-hover: #ef4444;
  --color-${p}success: #4ade80;
  --color-${p}warning: #fbbf24;
  --color-${p}info: #60a5fa;
}
`;
}

const cwd = process.cwd();

function exists(file) {
  return fs.existsSync(path.join(cwd, file));
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function writeTheme(file, prefix) {
  ensureDir(file);

  if (fs.existsSync(file)) {
    console.log(`Skipped: ${path.relative(cwd, file)} already exists.`);
    return false;
  }

  fs.writeFileSync(file, buildCss(prefix), 'utf8');
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

function cssOnly(prefix) {
  const target = path.join(cwd, 'src', 'flxtheme.css');
  writeTheme(target, prefix);
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

  const prefix = await input({
    message: 'Variable prefix (leave empty for none)',
    default: '',
  });

  if (framework === 'next') {
    const cssFile = findNextCss();

    if (!cssFile) {
      console.log('No Next.js global CSS found.');
      console.log('Falling back to CSS Only.\n');
      cssOnly(prefix);
      return;
    }

    const themeFile = path.join(path.dirname(cssFile), 'flxtheme.css');

    writeTheme(themeFile, prefix);
    injectImport(cssFile, themeFile);
    return;
  }

  if (framework === 'vite') {
    const cssFile = findViteCss();

    if (!cssFile) {
      console.log('No Vite CSS file found.');
      console.log('Falling back to CSS Only.\n');
      cssOnly(prefix);
      return;
    }

    const themeFile = path.join(cwd, 'src', 'flxtheme.css');

    writeTheme(themeFile, prefix);
    injectImport(cssFile, themeFile);
    return;
  }

  cssOnly(prefix);
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