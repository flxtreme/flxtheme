#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const TARGET = path.resolve(process.cwd(), 'flxtheme.css');

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

function run() {
  if (fs.existsSync(TARGET)) {
    console.log('flxtheme.css already exists — skipping (delete it first to regenerate).');
    return;
  }
  fs.writeFileSync(TARGET, CSS, 'utf8');
  console.log('Created flxtheme.css');
  console.log('Import it once in your app entry CSS: @import "./flxtheme.css";');
}

const cmd = process.argv[2];
if (cmd === 'init') {
  run();
} else {
  console.log('Usage: npx flxtheme init');
}