import React, { useState, useEffect, useRef } from 'react';
import {
  FlxTheme, useFlxTheme, ModalProvider,
  Header, Sidebar, Section, Hero,
  Button, IconButton,
  Card, CardHeader, CardBody, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableCell,
  Input, Textarea, Select, Checkbox, FormGroup,
  Menu, MenuItem, MenuDivider,
  Modal, useModal,
  Dropdown, DropdownItem, DropdownDivider,
  Badge, Spinner, Skeleton, Progress, Alert,
  Toast, ToastProvider, useToast,
  Tooltip, Popover, Drawer, ContextMenu, CommandPalette,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Breadcrumb, BreadcrumbItem,
  Pagination, Stepper,
} from 'flxtheme';
import {
  FiHome, FiUsers, FiSettings, FiBarChart2,
  FiMoon, FiSun, FiBell, FiSearch, FiPlus, FiEdit, FiTrash2,
  FiMoreVertical, FiMail, FiLock, FiChevronDown, FiBox,
  FiCheckSquare, FiChevronRight, FiLayout, FiImage, FiSquare,
  FiType, FiColumns, FiList, FiGrid, FiMaximize2, FiAlignLeft,
  FiToggleLeft, FiDatabase, FiDownload, FiDroplet, FiBookOpen,
  FiCopy, FiCheck, FiPackage, FiAlertCircle, FiTag,
  FiTrendingUp, FiLoader, FiRefreshCw,
  FiZap, FiMenu, FiMousePointer, FiTerminal, FiFile,
} from 'flxtheme/icons/fi';

const NAV_GROUPS = [
  {
    title: 'Setup',
    items: [
      { id: 'overview', label: 'Overview', icon: <FiBookOpen /> },
      { id: 'installation', label: 'Installation', icon: <FiDownload /> },
      { id: 'theme', label: 'Theme', icon: <FiDroplet /> },
      { id: 'icons', label: 'Icons', icon: <FiPackage /> },
    ],
  },
  {
    title: 'Layout',
    items: [
      { id: 'header', label: 'Header', icon: <FiLayout /> },
      { id: 'hero', label: 'Hero', icon: <FiImage /> },
      { id: 'section', label: 'Section', icon: <FiColumns /> },
      { id: 'sidebar', label: 'Sidebar', icon: <FiColumns /> },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { id: 'tabs', label: 'Tabs', icon: <FiColumns /> },
      { id: 'breadcrumb', label: 'Breadcrumb', icon: <FiChevronRight /> },
      { id: 'pagination', label: 'Pagination', icon: <FiList /> },
      { id: 'stepper', label: 'Stepper', icon: <FiLayout /> },
      { id: 'dropdown', label: 'Dropdown', icon: <FiChevronDown /> },
      { id: 'menu', label: 'Menu', icon: <FiList /> },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { id: 'badge', label: 'Badge', icon: <FiTag /> },
      { id: 'card', label: 'Card', icon: <FiGrid /> },
      { id: 'table', label: 'Table', icon: <FiDatabase /> },
    ],
  },
  {
    title: 'Feedback & Status',
    items: [
      { id: 'alert', label: 'Alert', icon: <FiAlertCircle /> },
      { id: 'progress', label: 'Progress', icon: <FiTrendingUp /> },
      { id: 'skeleton', label: 'Skeleton', icon: <FiLoader /> },
      { id: 'spinner', label: 'Spinner', icon: <FiRefreshCw /> },
      { id: 'toast', label: 'Toast', icon: <FiBell /> },
    ],
  },
  {
    title: 'Forms & Inputs',
    items: [
      { id: 'button', label: 'Button', icon: <FiSquare /> },
      { id: 'checkbox', label: 'Checkbox', icon: <FiCheckSquare /> },
      { id: 'formgroup', label: 'FormGroup', icon: <FiAlignLeft /> },
      { id: 'iconbutton', label: 'IconButton', icon: <FiBox /> },
      { id: 'input', label: 'Input', icon: <FiType /> },
      { id: 'select', label: 'Select', icon: <FiToggleLeft /> },
      { id: 'textarea', label: 'Textarea', icon: <FiAlignLeft /> },
    ],
  },
  {
    title: 'Overlay & Interaction',
    items: [
      { id: 'commandpalette', label: 'CommandPalette', icon: <FiTerminal /> },
      { id: 'contextmenu', label: 'ContextMenu', icon: <FiMousePointer /> },
      { id: 'drawer', label: 'Drawer', icon: <FiColumns /> },
      { id: 'modal', label: 'Modal', icon: <FiMaximize2 /> },
      { id: 'popover', label: 'Popover', icon: <FiMenu /> },
      { id: 'tooltip', label: 'Tooltip', icon: <FiZap /> },
    ],
  },
];

const NAV_SECTIONS = NAV_GROUPS.flatMap(g => g.items);

function highlight(src: string): React.ReactNode[] {
  const tokenRe = /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*|\/?>)|(\b(?:import|export|from|const|let|var|return|function|default|new|true|false|as)\b)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0, key = 0, m: RegExpExecArray | null;
  while ((m = tokenRe.exec(src))) {
    if (m.index > last) nodes.push(src.slice(last, m.index));
    const [full, comment, str, tag, kw] = m;
    if (comment) nodes.push(<span key={key++} className="text-slate-500 italic">{comment}</span>);
    else if (str) nodes.push(<span key={key++} className="text-green-300">{str}</span>);
    else if (tag) nodes.push(<span key={key++} className="text-sky-300">{tag}</span>);
    else if (kw) nodes.push(<span key={key++} className="text-violet-300">{kw}</span>);
    last = m.index + full.length;
  }
  if (last < src.length) nodes.push(src.slice(last));
  return nodes;
}

const Code: React.FC<{ children: string; lang?: string }> = ({ children, lang = 'tsx' }) => {
  const [copied, setCopied] = useState(false);
  const code = children.trim();
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { }
  };
  return (
    <div className="relative my-3 border border-solid border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-[#293548] px-3.5 py-2 border-b border-solid border-slate-700">
        <span className="text-xs text-slate-400 font-mono tracking-wide">{lang}</span>
        <button type="button" onClick={handleCopy} aria-label="Copy"
          className={`flex items-center gap-1.5 border-none rounded font-inherit font-semibold text-xs px-2 py-1 cursor-pointer transition-all duration-150 ${copied ? 'bg-success/15 text-success' : 'bg-transparent text-slate-400 hover:text-slate-200'}`}>
          {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-slate-800 text-slate-200 p-5 overflow-x-auto text-[0.8rem] leading-[1.75] m-0 font-mono"><code>{highlight(code)}</code></pre>
    </div>
  );
};

const Preview: React.FC<{ children: React.ReactNode; column?: boolean }> = ({ children, column }) => (
  <div className={`bg-muted border border-solid border-border rounded-xl p-6 flex flex-wrap ${column ? 'flex-col items-start' : 'flex-row items-center'} gap-3 my-4`}>{children}</div>
);

const PropBadge: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'default' }> = ({ children, variant = 'default' }) => {
  const cls = { primary: 'bg-primary/10 text-primary', secondary: 'bg-secondary/10 text-secondary', default: 'bg-muted text-foreground' };
  return <code className={`${cls[variant]} px-2 py-0.5 rounded-md text-[0.78rem] font-mono`}>{children}</code>;
};

interface PropRowData { name: string; type: string; def?: string; desc: string }

const PropsTable: React.FC<{ rows: PropRowData[] }> = ({ rows }) => (
  <div className="mt-5">
    <p className="font-bold text-xs text-muted-foreground mb-2 uppercase tracking-wider">Props</p>
    <Table bordered>
      <TableHeader><TableRow>{['Prop', 'Type', 'Default', 'Description'].map(h => <TableCell key={h} header>{h}</TableCell>)}</TableRow></TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            <TableCell><PropBadge variant="primary">{r.name}</PropBadge></TableCell>
            <TableCell><PropBadge variant="secondary">{r.type}</PropBadge></TableCell>
            <TableCell><PropBadge>{r.def ?? '—'}</PropBadge></TableCell>
            <TableCell className="text-muted-foreground text-[0.82rem]">{r.desc}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const Anchor: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <div id={id} className="scroll-mt-6">{children}</div>
);
const Divider = () => <div className="h-px bg-border my-2 mb-10" />;
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-5 mb-1.5 font-semibold text-[0.82rem] text-muted-foreground first:mt-0">{children}</p>
);

function ThemeToggle() {
  const { mode, toggleMode } = useFlxTheme();
  return <IconButton icon={mode === 'light' ? <FiMoon /> : <FiSun />} aria-label="Toggle theme" onClick={toggleMode} variant="ghost" />;
}

function ModalContextDemo() {
  const { openModal, closeModal } = useModal();
  return (
    <>
      <Button variant="outline" onClick={() => openModal('docs-modal')}>Open via useModal()</Button>
      <Modal id="docs-modal" title="Context-driven Modal" size="sm"
        footer={<div className="flex gap-2"><Button variant="ghost" onClick={() => closeModal('docs-modal')}>Cancel</Button><Button variant="primary" onClick={() => closeModal('docs-modal')}>Confirm</Button></div>}>
        <p className="m-0 text-muted-foreground text-[0.9rem]">Opened via <code>openModal('docs-modal')</code>. No prop drilling needed.</p>
      </Modal>
    </>
  );
}

function DrawerSection() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  return (
    <Anchor id="drawer">
      <Section title="Drawer" subtitle="Slide-in panel from any edge · title · footer · keyboard dismiss" padded={false}>
        <Code>{`import { Drawer } from 'flxtheme';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings"
  footer={<Button onClick={() => setOpen(false)}>Done</Button>}>
  <p>Drawer body content.</p>
</Drawer>`}</Code>
        <Label>Sides</Label>
        <Preview>
          {(['right', 'left', 'bottom', 'top'] as const).map(s => (
            <Button key={s} variant="outline" size="sm" onClick={() => { setSide(s); setOpen(true); }}>Open {s}</Button>
          ))}
        </Preview>
        <Drawer open={open} onClose={() => setOpen(false)} side={side}
          title={`${side.charAt(0).toUpperCase() + side.slice(1)} Drawer`}
          footer={<div className="flex gap-2 justify-end"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Save</Button></div>}>
          <p className="text-muted-foreground text-sm">Slides in from the <strong>{side}</strong>. Press <kbd>Esc</kbd> or click the backdrop to close.</p>
        </Drawer>
        <PropsTable rows={[
          { name: 'open', type: 'boolean', def: '—', desc: 'Controls visibility (required)' },
          { name: 'onClose', type: 'function', def: '—', desc: 'Called on backdrop click or Escape key (required)' },
          { name: 'side', type: 'string', def: "'right'", desc: 'left | right | top | bottom' },
          { name: 'size', type: 'string', def: '320px', desc: 'Width (horizontal) or height (vertical)' },
          { name: 'title', type: 'ReactNode', def: '—', desc: 'Header title; renders close button when provided' },
          { name: 'footer', type: 'ReactNode', def: '—', desc: 'Sticky footer area for action buttons' },
          { name: 'children', type: 'ReactNode', def: '—', desc: 'Scrollable body content' },
        ]} />
      </Section>
    </Anchor>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <Preview>
      {(['info', 'success', 'warning', 'error'] as const).map(v => (
        <Button key={v} variant="outline" size="sm"
          onClick={() => toast({ variant: v, title: v.charAt(0).toUpperCase() + v.slice(1), message: `This is a ${v} toast.` })}>
          {v}
        </Button>
      ))}
      <Button variant="ghost" size="sm"
        onClick={() => toast({ variant: 'info', title: 'Sticky', message: 'This stays until dismissed.', duration: 0 })}>
        Sticky (duration 0)
      </Button>
    </Preview>
  );
}

function DocsContent() {
  const [activeSection, setActiveSection] = useState('overview');
  const [controlledModal, setControlledModal] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [checkA, setCheckA] = useState(false);
  const [checkB, setCheckB] = useState(true);
  const [sidebarDemo, setSidebarDemo] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [tableHoverRow, setTableHoverRow] = useState<number | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { root: mainRef.current, rootMargin: '-15% 0px -75% 0px' }
    );
    NAV_SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => { setActiveSection(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const simulateLoad = () => { setLoadingBtn(true); setTimeout(() => setLoadingBtn(false), 2000); };

  const TABLE_USERS = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active' },
  ];

  const COMMANDS = [
    { id: 'home', group: 'Navigation', label: 'Go to Dashboard', description: 'Navigate to the main dashboard', icon: <FiHome />, shortcut: '⌘1', onSelect: () => { } },
    { id: 'users', group: 'Navigation', label: 'Go to Users', description: 'Manage team members', icon: <FiUsers />, shortcut: '⌘2', onSelect: () => { } },
    { id: 'analytics', group: 'Navigation', label: 'Go to Analytics', description: 'View charts and metrics', icon: <FiBarChart2 />, onSelect: () => { } },
    { id: 'new-file', group: 'Actions', label: 'New File', description: 'Create a new document', icon: <FiFile />, shortcut: '⌘N', onSelect: () => { } },
    { id: 'search', group: 'Actions', label: 'Search', description: 'Search across everything', icon: <FiSearch />, shortcut: '⌘F', onSelect: () => { } },
    { id: 'settings', group: 'Actions', label: 'Open Settings', description: 'Configure your preferences', icon: <FiSettings />, shortcut: '⌘,', onSelect: () => { } },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar collapsed={navCollapsed} onCollapsedChange={setNavCollapsed} title="flxtheme" className="h-full shrink-0 shadow">
        <div className="flex flex-col h-full">
          <div>
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.title} className={gi < NAV_GROUPS.length - 1 ? 'mb-5' : ''}>
                <div className="relative h-3.5 mb-2 flex items-center">
                  <p className={`absolute px-7 inset-0 text-xs font-bold uppercase tracking-wider leading-none whitespace-nowrap text-muted-foreground transition-opacity duration-200 ${navCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>{group.title}</p>
                  <div className={`h-0.5 w-full bg-border rounded-full transition-opacity duration-200 ${navCollapsed ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <Menu orientation="vertical">
                  {group.items.map(s => (
                    <MenuItem key={s.id} icon={s.icon} active={activeSection === s.id} onClick={() => scrollTo(s.id)} aria-label={s.label} className="py-1">
                      <span className={`transition-opacity duration-200 ${navCollapsed ? 'opacity-0' : 'opacity-100'}`}>{s.label}</span>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header sticky={false} logo={<span className="font-extrabold text-lg text-foreground tracking-tight">Docs</span>} className="shadow"
          actions={<><span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-mono">v1.0.0</span><ThemeToggle /><Button variant="primary" size="sm">GitHub</Button></>} />

        <main ref={mainRef} className="flex-1 overflow-y-auto px-12 pt-4 pb-24 min-w-0">
          <Hero title="flxtheme Component Reference" subtitle="Every component, live. Categorized with props tables and copy-ready code."
            size="sm" centered={false}
            actions={<><Button variant="outline" size="md" className="bg-white/15 border-white/35 text-white">npm i flxtheme</Button><Button variant="ghost" size="md" className="text-white">GitHub →</Button></>}
            className="rounded-2xl my-6 mb-12 max-w-7xl mx-auto" />

          {/* ── SETUP ── */}
          <Anchor id="overview">
            <Section title="Overview" subtitle="A React component library and theming system for modern dashboards and web apps." padded={false}>
              <p className="mb-5 text-foreground text-[0.95rem] leading-[1.7]">
                flxtheme gives you a cohesive set of UI primitives wired to a single design token layer. Swap colors, radius, and typography in one place and every component updates automatically.
              </p>
              <div className="grid gap-4 mb-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {[
                  { icon: <FiDroplet />, title: 'Themeable', desc: 'One token layer drives every component, light and dark included.' },
                  { icon: <FiBox />, title: '27 components', desc: 'Layout, navigation, data display, forms, overlays.' },
                  { icon: <FiLayout />, title: 'Composable', desc: 'Small primitives that combine into full interfaces.' },
                  { icon: <FiCheckSquare />, title: 'Typed', desc: 'Full TypeScript — no extra @types package.' },
                ].map(f => (
                  <Card key={f.title} variant="outlined" padding="md" hoverable>
                    <CardBody>
                      <div className="text-primary text-lg mb-2">{f.icon}</div>
                      <p className="mb-1 font-bold text-[0.9rem] text-foreground">{f.title}</p>
                      <p className="m-0 text-[0.8rem] text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
              <Label>Quick example</Label>
              <Code lang="tsx">{`import { FlxTheme, ModalProvider, Card, CardBody, Button } from 'flxtheme';

export default function App() {
  return (
    <FlxTheme>
      <ModalProvider>
        <Card><CardBody><Button variant="primary">Get started</Button></CardBody></Card>
      </ModalProvider>
    </FlxTheme>
  );
}`}</Code>
              <Card variant="filled" padding="md" className="mt-6">
                <CardBody><p className="m-0 text-[0.875rem] text-foreground">New to flxtheme? Continue to <strong>Installation</strong> to get set up, then <strong>Theme</strong> to customize tokens.</p></CardBody>
              </Card>
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="installation">
            <Section title="Installation" subtitle="Get flxtheme and Tailwind CSS running in under a minute." padded={false}>
              <Label>1. Install Tailwind CSS and flxtheme</Label>
              <Code lang="bash">{`npm install -D tailwindcss postcss autoprefixer
npm install flxtheme`}</Code>
              <Label>2. Register the flxtheme preset in tailwind.config.js</Label>
              <Code lang="js">{`/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('flxtheme/tailwind-preset')],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/flxtheme/dist/**/*.{js,mjs}',
  ],
};`}</Code>
              <Label>3. Add Tailwind directives to globals.css</Label>
              <Code lang="css">{`@tailwind base;
@tailwind components;
@tailwind utilities;`}</Code>
              <Label>4. Import globals.css at your app entry</Label>
              <Code lang="tsx">{`// main.tsx
import './globals.css';`}</Code>
              <Label>5. Wrap your app</Label>
              <Code lang="tsx">{`import { FlxTheme, ModalProvider } from 'flxtheme';

export default function App() {
  return (
    <FlxTheme defaultMode="light">
      <ModalProvider>
        <YourApp />
      </ModalProvider>
    </FlxTheme>
  );
}`}</Code>
              <Label>6. Import and use</Label>
              <Code lang="tsx">{`import { Button, Card, CardBody } from 'flxtheme';

function Example() {
  return (
    <Card><CardBody><Button variant="primary">It works</Button></CardBody></Card>
  );
}`}</Code>
              <Card variant="filled" padding="md" className="mt-6">
                <CardBody><p className="m-0 text-[0.875rem] text-foreground"><strong>Requirements:</strong> React 18+ and Tailwind CSS 3+.</p></CardBody>
              </Card>
              <PropsTable rows={[
                { name: 'FlxTheme.theme', type: 'FlxThemeConfig', def: 'defaultTheme', desc: 'Override light/dark tokens, radius, and font' },
                { name: 'FlxTheme.defaultMode', type: 'string', def: "'light'", desc: "Initial color mode: 'light' | 'dark'" },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="theme">
            <Section title="Theme" subtitle="Customize colors, radius, and font — or toggle light/dark at runtime." padded={false}>
              <Label>Default tokens</Label>
              <Code lang="tsx">{`import { defaultTheme } from 'flxtheme';

defaultTheme.light.primary   // '#6366f1'
defaultTheme.dark.primary    // '#818cf8'
defaultTheme.radius          // '0.5rem'
defaultTheme.fontFamily      // "'Inter', system-ui, sans-serif"`}</Code>
              <Label>Custom theme</Label>
              <Code lang="tsx">{`import { FlxTheme } from 'flxtheme';
import type { FlxThemeConfig } from 'flxtheme';

const theme: FlxThemeConfig = {
  light: { primary: '#0ea5e9', primaryHover: '#0284c7', /* ... */ },
  dark:  { primary: '#38bdf8', primaryHover: '#0ea5e9', /* ... */ },
  radius: '0.375rem',
  fontFamily: "'Geist', system-ui, sans-serif",
};

<FlxTheme theme={theme} defaultMode="light"><YourApp /></FlxTheme>`}</Code>
              <Label>useFlxTheme hook</Label>
              <Code lang="tsx">{`import { useFlxTheme } from 'flxtheme';

function ThemeToggle() {
  const { mode, toggleMode } = useFlxTheme();
  return <button onClick={toggleMode}>{mode === 'light' ? 'Dark' : 'Light'}</button>;
}`}</Code>
              <Label>Live color tokens</Label>
              <Preview>
                {(['primary', 'secondary', 'tertiary', 'success', 'warning', 'destructive', 'info'] as const).map(c => (
                  <div key={c} className="text-center">
                    <div className={`w-14 h-14 rounded-lg mb-1.5 border border-solid border-border bg-${c}`} />
                    <span className="text-[0.72rem] text-muted-foreground font-mono">--flx-{c}</span>
                  </div>
                ))}
              </Preview>
              <Label>All CSS variables</Label>
              <Table bordered>
                <TableHeader><TableRow><TableCell header>CSS variable</TableCell><TableCell header>Purpose</TableCell></TableRow></TableHeader>
                <TableBody>
                  {[
                    ['--flx-primary / --flx-primary-hover', 'Brand primary and hover'],
                    ['--flx-secondary / --flx-secondary-hover', 'Secondary accent and hover'],
                    ['--flx-tertiary', 'Tertiary accent'],
                    ['--flx-background / --flx-foreground', 'Page background and text'],
                    ['--flx-surface / --flx-surface-hover', 'Card and panel backgrounds'],
                    ['--flx-border', 'Borders and dividers'],
                    ['--flx-muted / --flx-muted-foreground', 'Subtle backgrounds and dimmed text'],
                    ['--flx-accent / --flx-accent-foreground', 'Accent backgrounds and matching text'],
                    ['--flx-destructive / --flx-destructive-hover', 'Error and danger states'],
                    ['--flx-success', 'Positive feedback'],
                    ['--flx-warning', 'Caution states'],
                    ['--flx-info', 'Informational states'],
                    ['--flx-radius', 'Global border radius'],
                    ['--flx-font-family', 'Global font stack'],
                  ].map(([token, purpose]) => (
                    <TableRow key={token}>
                      <TableCell><PropBadge variant="primary">{token}</PropBadge></TableCell>
                      <TableCell className="text-muted-foreground text-[0.82rem]">{purpose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PropsTable rows={[
                { name: 'useFlxTheme().mode', type: 'string', def: '—', desc: "'light' | 'dark'" },
                { name: 'useFlxTheme().toggleMode', type: 'function', def: '—', desc: 'Flips between light and dark' },
                { name: 'useFlxTheme().setMode', type: 'function', def: '—', desc: "Explicitly sets 'light' | 'dark'" },
                { name: 'useFlxTheme().colors', type: 'object', def: '—', desc: 'Resolved tokens for the active mode' },
                { name: 'useFlxTheme().theme', type: 'object', def: '—', desc: 'Full config passed to <FlxTheme>' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="icons">
            <Section title="Icons" subtitle="flxtheme bundles react-icons under per-set subpaths — no separate install needed." padded={false}>
              <Label>Import from a per-set subpath</Label>
              <Code lang="tsx">{`import { FiEdit, FiTrash2 } from 'flxtheme/icons/fi';
import { MdHome } from 'flxtheme/icons/md';
import { AiOutlineHeart } from 'flxtheme/icons/ai';`}</Code>
              <Label>With components</Label>
              <Code lang="tsx">{`import { Button, IconButton } from 'flxtheme';
import { FiPlus, FiTrash2 } from 'flxtheme/icons/fi';

<Button variant="primary"><FiPlus /> Add item</Button>
<IconButton icon={<FiTrash2 />} aria-label="Delete" variant="destructive" />`}</Code>
              <Label>fi set preview</Label>
              <Preview>
                {[{ Icon: FiHome, name: 'FiHome' }, { Icon: FiSettings, name: 'FiSettings' }, { Icon: FiSearch, name: 'FiSearch' }, { Icon: FiBell, name: 'FiBell' }, { Icon: FiEdit, name: 'FiEdit' }, { Icon: FiTrash2, name: 'FiTrash2' }, { Icon: FiMail, name: 'FiMail' }, { Icon: FiLock, name: 'FiLock' }].map(({ Icon, name }) => (
                  <div key={name} className="text-center w-[76px]">
                    <div className="w-11 h-11 flex items-center justify-center bg-surface border border-solid border-border rounded-lg mx-auto mb-1.5 text-primary text-lg"><Icon /></div>
                    <span className="text-[0.68rem] text-muted-foreground font-mono">{name}</span>
                  </div>
                ))}
              </Preview>
              <Card variant="filled" padding="md" className="mt-4">
                <CardBody><p className="m-0 text-[0.875rem] text-foreground">Full catalog at <a href="https://react-icons.github.io/react-icons" target="_blank" rel="noreferrer" className="text-primary font-semibold">react-icons.github.io/react-icons</a> — every set available under <code>flxtheme/icons/&lt;set&gt;</code>.</p></CardBody>
              </Card>
            </Section>
          </Anchor>
          <Divider />

          {/* ── LAYOUT ── */}
          <Anchor id="header">
            <Section title="Header" subtitle="Top navigation bar with logo slot, nav area, and actions. Sticky by default." padded={false}>
              <Code>{`import { Header } from 'flxtheme';

<Header sticky logo={<strong className="text-primary">MyApp</strong>}
  actions={<><ThemeToggle /><Button size="sm">Sign in</Button></>}>
  {/* nav links */}
</Header>`}</Code>
              <div className="border border-solid border-border rounded-xl overflow-hidden mt-4">
                <Header sticky={false} logo={<strong className="text-primary text-[1.1rem]">MyApp</strong>}
                  actions={<><IconButton icon={<FiBell />} aria-label="Notifications" variant="ghost" /><Button variant="ghost" size="sm">Sign in</Button><Button size="sm">Get started</Button></>}>
                  <span className="flex gap-5 text-[0.875rem] text-muted-foreground">
                    {['Home', 'Docs', 'Pricing', 'Blog'].map(l => <a key={l} href="#" className="no-underline text-inherit">{l}</a>)}
                  </span>
                </Header>
              </div>
              <PropsTable rows={[
                { name: 'logo', type: 'ReactNode', def: '—', desc: 'Left-aligned brand element' },
                { name: 'actions', type: 'ReactNode', def: '—', desc: 'Right-aligned controls' },
                { name: 'sticky', type: 'boolean', def: 'true', desc: 'Positions header as sticky top-0' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="hero">
            <Section title="Hero" subtitle="Full-width promotional section with gradient background and CTA actions" padded={false}>
              <Code>{`import { Hero, Button } from 'flxtheme';

<Hero title="Ship faster with flxtheme" size="md" centered
  actions={<Button variant="outline" className="text-white border-white/40">Get started</Button>}
/>`}</Code>
              <div className="rounded-xl overflow-hidden mt-4">
                <Hero title="Ship faster with flxtheme" subtitle="Production-ready components on a consistent design system." size="sm" centered
                  actions={<><Button variant="outline" className="bg-white/15 border-white/35 text-white">Get started</Button><Button variant="ghost" className="text-white">View docs →</Button></>} />
              </div>
              <PropsTable rows={[
                { name: 'title', type: 'string', def: '—', desc: 'Main headline (required)' },
                { name: 'subtitle', type: 'string', def: '—', desc: 'Supporting text' },
                { name: 'actions', type: 'ReactNode', def: '—', desc: 'CTA buttons' },
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md | lg | full' },
                { name: 'centered', type: 'boolean', def: 'true', desc: 'Centers text and actions' },
                { name: 'backgroundImage', type: 'string', def: '—', desc: 'Full-bleed background image URL' },
                { name: 'overlay', type: 'boolean', def: 'true', desc: 'Dark scrim over background image' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="section">
            <Section title="Section" subtitle="Semantic <section> with optional title, subtitle, and padding" padded={false}>
              <Code>{`import { Section } from 'flxtheme';

<Section title="Our features" subtitle="Everything you need." padded>
  <FeatureGrid />
</Section>`}</Code>
              <div className="border border-solid border-border rounded-xl overflow-hidden mt-4">
                <Section title="Our features" subtitle="Everything you need to build faster." className="p-8">
                  <div className="grid grid-cols-3 gap-3">
                    {['⚡ Fast', '♿ Accessible', '🎨 Themeable', '📦 Tree-shakeable', '🔒 Type-safe', '🌙 Dark mode'].map(f => (
                      <Card key={f} variant="filled" padding="sm"><CardBody className="font-semibold text-[0.875rem]">{f}</CardBody></Card>
                    ))}
                  </div>
                </Section>
              </div>
              <PropsTable rows={[
                { name: 'title', type: 'string', def: '—', desc: 'Section heading' },
                { name: 'subtitle', type: 'string', def: '—', desc: 'Description below title' },
                { name: 'padded', type: 'boolean', def: 'true', desc: 'Adds vertical padding' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="sidebar">
            <Section title="Sidebar" subtitle="Collapsible <aside> panel with controlled or uncontrolled state" padded={false}>
              <Code>{`import { Sidebar } from 'flxtheme';

<Sidebar title="flxtheme" width="280px" collapsedWidth="80px">
  <Menu orientation="vertical">
    <MenuItem icon={<FiHome />} active>Dashboard</MenuItem>
  </Menu>
</Sidebar>`}</Code>
              <div className="border border-solid border-border rounded-xl overflow-hidden flex h-[300px] mt-4">
                <Sidebar collapsed={sidebarDemo} onCollapsedChange={setSidebarDemo} width="220px" collapsedWidth="60px">
                  <div className={sidebarDemo ? 'p-4 px-2' : 'p-4 px-5'}>
                    {!sidebarDemo && <div className="font-bold text-base text-primary mb-4">flxtheme</div>}
                    <Menu orientation="vertical">
                      <MenuItem icon={<FiHome />} active={true}>Dashboard</MenuItem>
                      <MenuItem icon={<FiBarChart2 />}>Analytics</MenuItem>
                      <MenuItem icon={<FiUsers />}>Team</MenuItem>
                      <MenuDivider />
                      <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                    </Menu>
                  </div>
                </Sidebar>
                <div className="flex-1 p-6 bg-surface">
                  <p className="m-0 text-muted-foreground text-[0.875rem]">Main content area.
                    <br /><br />
                    <Button size="sm" variant="outline" onClick={() => setSidebarDemo(v => !v)}>
                      {sidebarDemo ? 'Expand' : 'Collapse'} sidebar
                    </Button>
                  </p>
                </div>
              </div>
              <PropsTable rows={[
                { name: 'collapsed', type: 'boolean', def: '—', desc: 'Controlled collapsed state' },
                { name: 'onCollapsedChange', type: 'function', def: '—', desc: 'Called with next value on toggle' },
                { name: 'title', type: 'ReactNode', def: '—', desc: 'Brand title in the sidebar header' },
                { name: 'width', type: 'string', def: "'280px'", desc: 'Expanded width' },
                { name: 'collapsedWidth', type: 'string', def: "'80px'", desc: 'Collapsed width' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          {/* ── NAVIGATION ── */}
          <Anchor id="tabs">
            <Section title="Tabs" subtitle="Horizontal or vertical tabbed panels · controlled state" padded={false}>
              <Code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from 'flxtheme';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
  <TabsContent value="tab3">Content for tab 3</TabsContent>
</Tabs>`}</Code>
              <Label>Horizontal (default)</Label>
              <Preview>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account"><p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p></TabsContent>
                  <TabsContent value="password"><p className="text-sm text-muted-foreground">Change your password and security options.</p></TabsContent>
                  <TabsContent value="notifications"><p className="text-sm text-muted-foreground">Control how you receive notifications.</p></TabsContent>
                </Tabs>
              </Preview>
              <PropsTable rows={[
                { name: 'defaultValue', type: 'string', def: '—', desc: 'Default active tab value' },
                { name: 'value', type: 'string', def: '—', desc: 'Controlled active tab value' },
                { name: 'onValueChange', type: 'function', def: '—', desc: 'Called when tab changes' },
                { name: 'direction', type: 'string', def: "'horizontal'", desc: 'horizontal | vertical' },
                { name: 'TabsTrigger.value', type: 'string', def: '—', desc: 'Unique value for this tab' },
                { name: 'TabsContent.value', type: 'string', def: '—', desc: 'Shows when parent tab is active' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="breadcrumb">
            <Section title="Breadcrumb" subtitle="Hierarchical location trail · active state · navigation links" padded={false}>
              <Code>{`import { Breadcrumb, BreadcrumbItem } from 'flxtheme';

<Breadcrumb separator="/">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem isActive>Details</BreadcrumbItem>
</Breadcrumb>`}</Code>
              <Label>Example</Label>
              <Preview>
                <Breadcrumb separator="/">
                  <BreadcrumbItem href="#">Home</BreadcrumbItem>
                  <BreadcrumbItem href="#">Documentation</BreadcrumbItem>
                  <BreadcrumbItem href="#">Components</BreadcrumbItem>
                  <BreadcrumbItem isActive>Breadcrumb</BreadcrumbItem>
                </Breadcrumb>
              </Preview>
              <Label>Custom separator</Label>
              <Preview>
                <Breadcrumb separator=">">
                  <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
                  <BreadcrumbItem href="#">Reports</BreadcrumbItem>
                  <BreadcrumbItem isActive>Analytics</BreadcrumbItem>
                </Breadcrumb>
              </Preview>
              <PropsTable rows={[
                { name: 'separator', type: 'ReactNode', def: "'/'", desc: 'Divider between items' },
                { name: 'BreadcrumbItem.href', type: 'string', def: '—', desc: 'Renders as <a> tag' },
                { name: 'BreadcrumbItem.isActive', type: 'boolean', def: 'false', desc: 'Highlights as current page' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="pagination">
            <Section title="Pagination" subtitle="Page number controls · Previous/Next buttons · smart range" padded={false}>
              <Code>{`import { Pagination } from 'flxtheme';
import { useState } from 'react';

const [page, setPage] = useState(1);

<Pagination 
  total={100} 
  current={page} 
  pageSize={10} 
  onPageChange={setPage}
  showTotal
/>`}</Code>
              <Label>Example (25 items, 10 per page)</Label>
              <Preview column>
                <Pagination 
                  total={25} 
                  current={1} 
                  pageSize={10} 
                  onPageChange={() => {}} 
                  showTotal
                />
              </Preview>
              <PropsTable rows={[
                { name: 'total', type: 'number', def: '—', desc: 'Total items (required)' },
                { name: 'current', type: 'number', def: '—', desc: 'Current page number (required)' },
                { name: 'pageSize', type: 'number', def: '10', desc: 'Items per page' },
                { name: 'onPageChange', type: 'function', def: '—', desc: 'Called with new page number' },
                { name: 'showTotal', type: 'boolean', def: 'true', desc: 'Shows total item count' },
                { name: 'showQuickJumper', type: 'boolean', def: 'false', desc: 'Input to jump to page (reserved)' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="stepper">
            <Section title="Stepper" subtitle="Multi-step process indicator · completed/error states · clickable steps" padded={false}>
              <Code>{`import { Stepper } from 'flxtheme';
import { useState } from 'react';

const [current, setCurrent] = useState(0);

const steps = [
  { id: 1, label: 'Step 1', description: 'Account details' },
  { id: 2, label: 'Step 2', description: 'Verification' },
  { id: 3, label: 'Step 3', description: 'Confirmation' },
];

<Stepper steps={steps} currentStep={current} onStepChange={setCurrent} />`}</Code>
              <Label>Horizontal</Label>
              <Preview>
                <Stepper 
                  steps={[
                    { id: 1, label: 'Personal Info', completed: true },
                    { id: 2, label: 'Address', completed: true },
                    { id: 3, label: 'Payment' },
                    { id: 4, label: 'Review' },
                  ]}
                  currentStep={2}
                  orientation="horizontal"
                  onStepChange={() => {}}
                />
              </Preview>
              <Label>With descriptions and error</Label>
              <Preview column>
                <Stepper 
                  steps={[
                    { id: 1, label: 'Step 1', description: 'Complete', completed: true },
                    { id: 2, label: 'Step 2', description: 'Current step' },
                    { id: 3, label: 'Step 3', description: 'Pending', error: false },
                  ]}
                  currentStep={1}
                  orientation="horizontal"
                  onStepChange={() => {}}
                />
              </Preview>
              <PropsTable rows={[
                { name: 'steps', type: 'StepperStep[]', def: '—', desc: 'Array of step objects' },
                { name: 'currentStep', type: 'number', def: '—', desc: 'Current step index' },
                { name: 'onStepChange', type: 'function', def: '—', desc: 'Called when step clicked' },
                { name: 'orientation', type: 'string', def: "'horizontal'", desc: 'horizontal | vertical' },
                { name: 'clickable', type: 'boolean', def: 'true', desc: 'Allow clicking steps' },
                { name: 'step.id', type: 'string|number', def: '—', desc: 'Unique identifier' },
                { name: 'step.label', type: 'string', def: '—', desc: 'Step title' },
                { name: 'step.description', type: 'string', def: '—', desc: 'Optional description' },
                { name: 'step.completed', type: 'boolean', def: 'false', desc: 'Shows checkmark' },
                { name: 'step.error', type: 'boolean', def: 'false', desc: 'Shows error state' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="dropdown">
            <Section title="Dropdown" subtitle="Click-triggered popup menu with outside-click dismissal" padded={false}>
              <Code>{`import { Dropdown, DropdownItem, DropdownDivider, Button } from 'flxtheme';
import { FiChevronDown, FiEdit, FiTrash2 } from 'flxtheme/icons/fi';

<Dropdown trigger={<Button variant="outline">Options <FiChevronDown /></Button>} align="left">
  <DropdownItem icon={<FiEdit />}>Edit</DropdownItem>
  <DropdownDivider />
  <DropdownItem icon={<FiTrash2 />} disabled>Delete</DropdownItem>
</Dropdown>`}</Code>
              <Preview>
                <Dropdown trigger={<Button variant="outline"><span className="flex items-center gap-1.5">Options <FiChevronDown /></span></Button>} align="left">
                  <DropdownItem icon={<FiEdit />}>Edit</DropdownItem>
                  <DropdownItem icon={<FiPlus />}>Duplicate</DropdownItem>
                  <DropdownItem icon={<FiSearch />}>Find similar</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={<FiTrash2 />} disabled>Delete (disabled)</DropdownItem>
                </Dropdown>
                <Dropdown trigger={<Button variant="secondary"><span className="flex items-center gap-1.5">Align right <FiChevronDown /></span></Button>} align="right">
                  <DropdownItem icon={<FiSettings />}>Settings</DropdownItem>
                  <DropdownItem icon={<FiUsers />}>Profile</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem icon={<FiTrash2 />}>Logout</DropdownItem>
                </Dropdown>
                <Dropdown trigger={<IconButton icon={<FiMoreVertical />} aria-label="More" variant="ghost" />}>
                  <DropdownItem icon={<FiEdit />}>Rename</DropdownItem>
                  <DropdownItem icon={<FiTrash2 />}>Archive</DropdownItem>
                </Dropdown>
              </Preview>
              <PropsTable rows={[
                { name: 'trigger', type: 'ReactNode', def: '—', desc: 'Element that opens/closes the menu' },
                { name: 'align', type: 'string', def: "'left'", desc: 'left | right' },
                { name: 'DropdownItem.icon', type: 'ReactNode', def: '—', desc: 'Icon before the label' },
                { name: 'DropdownItem.disabled', type: 'boolean', def: 'false', desc: 'Prevents click interaction' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="menu">
            <Section title="Menu" subtitle="Semantic <nav> list with active state, icons, dividers, and orientation" padded={false}>
              <Code>{`import { Menu, MenuItem, MenuDivider } from 'flxtheme';
import { FiHome, FiBarChart2, FiSettings } from 'flxtheme/icons/fi';

<Menu orientation="vertical">
  <MenuItem icon={<FiHome />} active href="/dashboard">Dashboard</MenuItem>
  <MenuItem icon={<FiBarChart2 />} href="/analytics">Analytics</MenuItem>
  <MenuDivider />
  <MenuItem icon={<FiSettings />} disabled>Settings (soon)</MenuItem>
</Menu>`}</Code>
              <Preview>
                <div className="w-[220px] bg-surface rounded-xl p-3 border border-solid border-border">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground mx-2 mb-2">Vertical</p>
                  <Menu orientation="vertical">
                    <MenuItem icon={<FiHome />} href="#" active>Dashboard</MenuItem>
                    <MenuItem icon={<FiBarChart2 />} href="#">Analytics</MenuItem>
                    <MenuItem icon={<FiUsers />} href="#">Team</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FiSettings />} disabled>Settings (soon)</MenuItem>
                  </Menu>
                </div>
                <div className="flex-1">
                  <p className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground mx-2 mb-2">Horizontal</p>
                  <div className="bg-surface rounded-xl px-3 py-2 border border-solid border-border">
                    <Menu orientation="horizontal">
                      <MenuItem href="#" active>Home</MenuItem>
                      <MenuItem href="#">Products</MenuItem>
                      <MenuItem href="#">Pricing</MenuItem>
                      <MenuItem href="#">Contact</MenuItem>
                    </Menu>
                  </div>
                </div>
              </Preview>
              <PropsTable rows={[
                { name: 'orientation', type: 'string', def: "'vertical'", desc: 'vertical | horizontal' },
                { name: 'MenuItem.active', type: 'boolean', def: 'false', desc: 'Highlights as selected' },
                { name: 'MenuItem.disabled', type: 'boolean', def: 'false', desc: 'Prevents click and dims' },
                { name: 'MenuItem.icon', type: 'ReactNode', def: '—', desc: 'Icon before the label' },
                { name: 'MenuItem.href', type: 'string', def: '—', desc: 'Renders as <a>' },
                { name: 'MenuItem.onClick', type: 'function', def: '—', desc: 'Click handler' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          {/* ── DATA DISPLAY ── */}
          <Anchor id="badge">
            <Section title="Badge" subtitle="6 variants · 2 sizes · status indicator" padded={false}>
              <Code>{`import { Badge } from 'flxtheme';

<Badge>New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="outline" size="sm">Draft</Badge>`}</Code>
              <Label>Variants</Label>
              <Preview>
                <Badge>Primary</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge><Badge variant="destructive">Destructive</Badge><Badge variant="outline">Outline</Badge>
              </Preview>
              <Label>Sizes</Label>
              <Preview><Badge size="sm">Small</Badge><Badge size="md">Medium</Badge></Preview>
              <PropsTable rows={[
                { name: 'variant', type: 'string', def: "'primary'", desc: 'primary | secondary | success | warning | destructive | outline' },
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="card">
            <Section title="Card" subtitle="Surface container with variants, padding presets, and hover lift" padded={false}>
              <Code>{`import { Card, CardHeader, CardBody, CardFooter } from 'flxtheme';

<Card variant="elevated" hoverable padding="lg">
  <CardHeader>Monthly Report</CardHeader>
  <CardBody>Revenue grew 24% this quarter.</CardBody>
  <CardFooter><Button size="sm">View details</Button></CardFooter>
</Card>`}</Code>
              <Preview>
                {(['default', 'outlined', 'elevated', 'filled'] as const).map(v => (
                  <Card key={v} variant={v} hoverable className="min-w-[165px] flex-1">
                    <CardHeader>{v.charAt(0).toUpperCase() + v.slice(1)}</CardHeader>
                    <CardBody><p className="m-0 text-muted-foreground text-[0.875rem]">Hover me — {v}.</p></CardBody>
                    <CardFooter><Button variant="outline" size="sm">Action</Button></CardFooter>
                  </Card>
                ))}
              </Preview>
              <Label>Padding presets</Label>
              <Preview>
                {(['none', 'sm', 'md', 'lg'] as const).map(p => (
                  <Card key={p} variant="outlined" padding={p} className="min-w-[120px]">
                    <CardBody className="text-[0.82rem] text-muted-foreground">pad={p}</CardBody>
                  </Card>
                ))}
              </Preview>
              <PropsTable rows={[
                { name: 'variant', type: 'string', def: "'default'", desc: 'default | outlined | elevated | filled' },
                { name: 'hoverable', type: 'boolean', def: 'false', desc: 'Adds a lift transform on hover' },
                { name: 'padding', type: 'string', def: "'md'", desc: 'none | sm | md | lg' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="table">
            <Section title="Table" subtitle="Responsive table with striped, hoverable, compact, and bordered modifiers" padded={false}>
              <Code>{`import { Table, TableHeader, TableBody, TableRow, TableCell } from 'flxtheme';

<Table striped hoverable>
  <TableHeader>
    <TableRow><TableCell header>Name</TableCell><TableCell header>Status</TableCell></TableRow>
  </TableHeader>
  <TableBody>
    {rows.map(row => (
      <TableRow key={row.id}><TableCell>{row.name}</TableCell><TableCell>{row.status}</TableCell></TableRow>
    ))}
  </TableBody>
</Table>`}</Code>
              <div className="mt-4">
                <Table striped hoverable>
                  <TableHeader>
                    <TableRow>{['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => <TableCell key={h} header>{h}</TableCell>)}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_USERS.map((row, i) => (
                      <TableRow key={row.id} selected={tableHoverRow === i} onMouseEnter={() => setTableHoverRow(i)} onMouseLeave={() => setTableHoverRow(null)}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="text-muted-foreground">{row.email}</TableCell>
                        <TableCell><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${row.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground'}`}>{row.role}</span></TableCell>
                        <TableCell><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{row.status}</span></TableCell>
                        <TableCell><div className="flex gap-1"><IconButton icon={<FiEdit />} aria-label="Edit" size="sm" variant="ghost" /><IconButton icon={<FiTrash2 />} aria-label="Delete" size="sm" variant="ghost" /></div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PropsTable rows={[
                { name: 'striped', type: 'boolean', def: 'false', desc: 'Alternates row backgrounds' },
                { name: 'hoverable', type: 'boolean', def: 'true', desc: 'Highlights rows on hover' },
                { name: 'compact', type: 'boolean', def: 'false', desc: 'Reduces cell padding' },
                { name: 'bordered', type: 'boolean', def: 'false', desc: 'Adds column dividers' },
                { name: 'TableRow.selected', type: 'boolean', def: 'false', desc: 'Highlights the row' },
                { name: 'TableCell.header', type: 'boolean', def: 'false', desc: 'Renders as <th>' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          {/* ── FEEDBACK & STATUS ── */}
          <Anchor id="alert">
            <Section title="Alert" subtitle="4 variants · icon + title + message · inline status messages" padded={false}>
              <Code>{`import { Alert } from 'flxtheme';

<Alert variant="info" title="Heads up">Your trial expires in 3 days.</Alert>
<Alert variant="success">Profile updated successfully.</Alert>
<Alert variant="warning" title="Warning">Unsaved changes will be lost.</Alert>
<Alert variant="error" title="Error">Failed to save changes.</Alert>`}</Code>
              <Label>Variants</Label>
              <Preview column>
                <Alert variant="info" title="Info">Your trial expires in 3 days.</Alert>
                <Alert variant="success" title="Success">Profile updated successfully.</Alert>
                <Alert variant="warning" title="Warning">Unsaved changes will be lost.</Alert>
                <Alert variant="error" title="Error">Failed to save changes.</Alert>
              </Preview>
              <Label>Without title</Label>
              <Preview column>
                <Alert variant="info">Plain info message without a title.</Alert>
                <Alert variant="success">Plain success message without a title.</Alert>
              </Preview>
              <PropsTable rows={[
                { name: 'variant', type: 'string', def: "'info'", desc: 'info | success | warning | error' },
                { name: 'title', type: 'string', def: '—', desc: 'Optional bold heading' },
                { name: 'children', type: 'ReactNode', def: '—', desc: 'Alert body content' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="progress">
            <Section title="Progress" subtitle="3 sizes · 4 variants · optional label" padded={false}>
              <Code>{`import { Progress } from 'flxtheme';

<Progress value={60} />
<Progress value={80} variant="success" showLabel />
<Progress value={45} variant="warning" size="lg" showLabel />`}</Code>
              <Label>Variants</Label>
              <Preview column>
                <Progress value={60} variant="primary" showLabel />
                <Progress value={80} variant="success" showLabel />
                <Progress value={45} variant="warning" showLabel />
                <Progress value={30} variant="destructive" showLabel />
              </Preview>
              <Label>Sizes</Label>
              <Preview column>
                <Progress value={60} size="sm" /><Progress value={60} size="md" /><Progress value={60} size="lg" />
              </Preview>
              <PropsTable rows={[
                { name: 'value', type: 'number', def: '—', desc: '0–100 (required)' },
                { name: 'variant', type: 'string', def: "'primary'", desc: 'primary | success | warning | destructive' },
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md | lg' },
                { name: 'showLabel', type: 'boolean', def: 'false', desc: 'Shows % text to the right' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="skeleton">
            <Section title="Skeleton" subtitle="3 variants · animated loading placeholder" padded={false}>
              <Code>{`import { Skeleton } from 'flxtheme';

<Skeleton className="h-4 w-48" />
<Skeleton variant="circular" className="w-10 h-10" />
<Skeleton variant="text" className="w-64" />`}</Code>
              <Preview column>
                <div className="flex items-center gap-4 w-full">
                  <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton variant="text" className="w-40" />
                    <Skeleton variant="text" className="w-64" />
                  </div>
                </div>
                <Skeleton variant="rectangular" className="h-24 w-full" />
              </Preview>
              <PropsTable rows={[
                { name: 'variant', type: 'string', def: "'rectangular'", desc: 'text | circular | rectangular' },
                { name: 'className', type: 'string', def: "''", desc: 'Controls size and shape' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="spinner">
            <Section title="Spinner" subtitle="3 sizes · 3 variants · loading indicator" padded={false}>
              <Code>{`import { Spinner } from 'flxtheme';

<Spinner />
<Spinner size="lg" variant="secondary" />`}</Code>
              <Label>Sizes</Label>
              <Preview><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /></Preview>
              <Label>Variants</Label>
              <Preview><Spinner variant="primary" size="lg" /><Spinner variant="secondary" size="lg" /><Spinner variant="muted" size="lg" /></Preview>
              <PropsTable rows={[
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md | lg' },
                { name: 'variant', type: 'string', def: "'primary'", desc: 'primary | secondary | muted' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="toast">
            <Section title="Toast" subtitle="4 variants · floating · auto-dismiss · useToast hook" padded={false}>
              <Code>{`import { ToastProvider, useToast } from 'flxtheme';

// 1. Wrap your app (once)
<ToastProvider defaultDuration={2500}>
  <App />
</ToastProvider>

// 2. Trigger from anywhere
function MyComponent() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ variant: 'success', title: 'Saved', message: 'Changes saved.' })}>
      Save
    </Button>
  );
}`}</Code>
              <Label>Trigger live toasts</Label>
              <ToastDemo />
              <Label>Static inline Toast</Label>
              <Code>{`import { Toast } from 'flxtheme';

<Toast variant="success" title="Done" onClose={() => {}}>Profile updated.</Toast>`}</Code>
              <Preview column>
                <Toast variant="info" title="Info" onClose={() => { }}>Your trial expires in 3 days.</Toast>
                <Toast variant="success" title="Success" onClose={() => { }}>Profile updated successfully.</Toast>
                <Toast variant="warning" title="Warning" onClose={() => { }}>Your session expires soon.</Toast>
                <Toast variant="error" title="Error" onClose={() => { }}>Failed to save changes.</Toast>
              </Preview>
              <PropsTable rows={[
                { name: 'ToastProvider.defaultDuration', type: 'number', def: '2500', desc: 'Auto-dismiss ms. 0 = sticky.' },
                { name: 'useToast().toast', type: 'function', def: '—', desc: '{ variant, title, message, duration? }' },
                { name: 'useToast().dismiss', type: 'function', def: '—', desc: 'Dismiss by id' },
                { name: 'Toast.variant', type: 'string', def: "'info'", desc: 'info | success | warning | error' },
                { name: 'Toast.title', type: 'string', def: '—', desc: 'Bold heading' },
                { name: 'Toast.onClose', type: 'function', def: '—', desc: 'Renders × button' },
                { name: 'Toast.duration', type: 'number', def: '2500', desc: 'Per-toast override ms. 0 = sticky.' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          {/* ── FORMS & INPUTS ── */}
          <Anchor id="button">
            <Section title="Button" subtitle="6 variants · 5 sizes · loading state · full-width" padded={false}>
              <Code>{`import { Button } from 'flxtheme';

<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" loading>Saving…</Button>
<Button variant="destructive" fullWidth>Delete account</Button>`}</Code>
              <Label>Variants</Label>
              <Preview>
                {(['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(v => (
                  <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
                ))}
              </Preview>
              <Label>Sizes</Label>
              <Preview>
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => <Button key={s} size={s}>Size {s.toUpperCase()}</Button>)}
              </Preview>
              <Label>States</Label>
              <Preview>
                <Button variant="primary" loading>Always loading</Button>
                <Button variant="secondary" loading={loadingBtn} onClick={simulateLoad}>{loadingBtn ? 'Saving…' : 'Click to load'}</Button>
                <Button variant="outline" disabled>Disabled</Button>
                <Button variant="primary" fullWidth className="max-w-60">Full width</Button>
              </Preview>
              <PropsTable rows={[
                { name: 'variant', type: 'string', def: "'primary'", desc: 'primary | secondary | outline | ghost | destructive | link' },
                { name: 'size', type: 'string', def: "'md'", desc: 'xs | sm | md | lg | xl' },
                { name: 'loading', type: 'boolean', def: 'false', desc: 'Shows spinner and disables button' },
                { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretches to container width' },
                { name: 'disabled', type: 'boolean', def: 'false', desc: 'Native disabled attribute' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="checkbox">
            <Section title="Checkbox" subtitle="Native checkbox with label and accent-color theming" padded={false}>
              <Code>{`import { Checkbox } from 'flxtheme';

<Checkbox label="Remember me" checked={val} onChange={e => setVal(e.target.checked)} />`}</Code>
              <Preview column>
                <Checkbox label="Unchecked (uncontrolled)" />
                <Checkbox label="Checked — controlled" checked={checkB} onChange={e => setCheckB(e.target.checked)} />
                <Checkbox label="Toggle me" checked={checkA} onChange={e => setCheckA(e.target.checked)} />
                <Checkbox label="Disabled" disabled />
                <Checkbox label="Disabled + checked" disabled checked />
              </Preview>
              <PropsTable rows={[
                { name: 'label', type: 'string', def: '—', desc: 'Text beside the checkbox' },
                { name: 'checked', type: 'boolean', def: '—', desc: 'Controlled state' },
                { name: 'onChange', type: 'function', def: '—', desc: 'Native change handler' },
                { name: 'disabled', type: 'boolean', def: 'false', desc: 'Native disabled' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="formgroup">
            <Section title="FormGroup" subtitle="<form> wrapper controlling field layout direction" padded={false}>
              <Code>{`import { FormGroup, Input, Button } from 'flxtheme';

<FormGroup layout="vertical" onSubmit={e => { e.preventDefault(); }}>
  <Input label="Email" type="email" placeholder="you@example.com" fullWidth />
  <Button type="submit" fullWidth>Subscribe</Button>
</FormGroup>`}</Code>
              <div className="grid gap-5 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                <Card>
                  <CardHeader>Vertical (default)</CardHeader>
                  <CardBody>
                    <FormGroup layout="vertical" onSubmit={e => e.preventDefault()}>
                      <Input label="Full name" placeholder="Jane Smith" fullWidth />
                      <Input label="Email" type="email" placeholder="jane@example.com" fullWidth />
                      <Checkbox label="Subscribe to newsletter" />
                      <Button type="submit" fullWidth>Sign up</Button>
                    </FormGroup>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Horizontal</CardHeader>
                  <CardBody>
                    <FormGroup layout="horizontal" onSubmit={e => e.preventDefault()}>
                      <Input placeholder="Search docs…" leftIcon={<FiSearch />} />
                      <Button>Search</Button>
                    </FormGroup>
                    <p className="text-[0.8rem] text-muted-foreground mt-3">Useful for inline search bars.</p>
                  </CardBody>
                </Card>
              </div>
              <PropsTable rows={[
                { name: 'layout', type: 'string', def: "'vertical'", desc: 'vertical | horizontal' },
                { name: 'onSubmit', type: 'function', def: '—', desc: 'Native form submit handler' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="iconbutton">
            <Section title="IconButton" subtitle="Square icon-only button. aria-label is required." padded={false}>
              <Code>{`import { IconButton } from 'flxtheme';
import { FiEdit, FiTrash2 } from 'flxtheme/icons/fi';

<IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" size="md" />
<IconButton icon={<FiTrash2 />} aria-label="Delete" variant="destructive" size="sm" />`}</Code>
              <Label>Variants</Label>
              <Preview>
                {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(v => (
                  <IconButton key={v} icon={<FiSettings />} aria-label={v} variant={v} size="md" />
                ))}
              </Preview>
              <Label>Sizes</Label>
              <Preview>
                <IconButton icon={<FiSearch />} aria-label="sm" variant="outline" size="sm" />
                <IconButton icon={<FiSearch />} aria-label="md" variant="outline" size="md" />
                <IconButton icon={<FiSearch />} aria-label="lg" variant="outline" size="lg" />
              </Preview>
              <Label>Common patterns</Label>
              <Preview>
                <IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" />
                <IconButton icon={<FiTrash2 />} aria-label="Delete" variant="ghost" />
                <IconButton icon={<FiPlus />} aria-label="Add" variant="primary" />
                <IconButton icon={<FiBell />} aria-label="Notifications" variant="ghost" />
                <IconButton icon={<FiMoreVertical />} aria-label="More" variant="ghost" />
              </Preview>
              <PropsTable rows={[
                { name: 'icon', type: 'ReactNode', def: '—', desc: 'Icon element (required)' },
                { name: 'aria-label', type: 'string', def: '—', desc: 'Accessible label (required)' },
                { name: 'variant', type: 'string', def: "'ghost'", desc: 'primary | secondary | outline | ghost | destructive' },
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md | lg' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="input">
            <Section title="Input" subtitle="Text field with label, icons, error state, and helper text" padded={false}>
              <Code>{`import { Input } from 'flxtheme';
import { FiMail, FiLock } from 'flxtheme/icons/fi';

<Input label="Email" type="email" placeholder="you@example.com" fullWidth />
<Input label="Password" leftIcon={<FiLock />} type="password" error="Too short." />`}</Code>
              <Preview column>
                <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                  <Input label="Default" placeholder="Type here…" />
                  <Input label="With helper" placeholder="Username" helperText="Letters and numbers only." />
                  <Input label="Error state" placeholder="Email" error="Invalid email address." />
                  <Input label="Left icon" leftIcon={<FiMail />} placeholder="you@example.com" />
                  <Input label="Right icon" rightIcon={<FiSearch />} placeholder="Search…" />
                  <Input label="Both icons" leftIcon={<FiLock />} rightIcon={<FiChevronRight />} placeholder="Password" type="password" />
                  <Input label="Disabled" placeholder="Can't touch this" disabled />
                  <Input label="Full width" placeholder="Stretches to container" fullWidth />
                </div>
              </Preview>
              <PropsTable rows={[
                { name: 'label', type: 'string', def: '—', desc: 'Label above the input' },
                { name: 'error', type: 'string', def: '—', desc: 'Error message; turns border red' },
                { name: 'helperText', type: 'string', def: '—', desc: 'Hint text below the field' },
                { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretches to fill container' },
                { name: 'leftIcon', type: 'ReactNode', def: '—', desc: 'Icon on the left inside' },
                { name: 'rightIcon', type: 'ReactNode', def: '—', desc: 'Icon on the right inside' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="select">
            <Section title="Select" subtitle="Native <select> with label, placeholder, error, and full-width support" padded={false}>
              <Code>{`import { Select } from 'flxtheme';

<Select label="Country" placeholder="Choose a country…"
  options={[{ value: 'ph', label: 'Philippines' }, { value: 'us', label: 'United States' }]}
  fullWidth
/>`}</Code>
              <Preview column>
                <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                  <Select label="Default" placeholder="Choose one…" options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]} />
                  <Select label="With error" placeholder="Select role…" error="Please select a role." options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }]} />
                  <Select label="With disabled option" options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }, { value: 'enterprise', label: 'Enterprise (contact us)', disabled: true }]} />
                  <Select label="Full width" placeholder="Country…" fullWidth options={[{ value: 'ph', label: 'Philippines' }, { value: 'us', label: 'United States' }, { value: 'jp', label: 'Japan' }]} />
                </div>
              </Preview>
              <PropsTable rows={[
                { name: 'options', type: 'array', def: '[]', desc: '{ value, label, disabled? }[]' },
                { name: 'label', type: 'string', def: '—', desc: 'Label above the select' },
                { name: 'placeholder', type: 'string', def: '—', desc: 'Disabled first option placeholder' },
                { name: 'error', type: 'string', def: '—', desc: 'Error message' },
                { name: 'helperText', type: 'string', def: '—', desc: 'Hint text below' },
                { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretches to fill container' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="textarea">
            <Section title="Textarea" subtitle="Resizable multi-line field — same label/error/helper API as Input" padded={false}>
              <Code>{`import { Textarea } from 'flxtheme';

<Textarea label="Message" placeholder="Tell us more…" helperText="Up to 500 characters." rows={4} fullWidth />`}</Code>
              <Preview column>
                <div className="grid gap-4 w-full grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                  <Textarea label="Default" placeholder="Start typing…" />
                  <Textarea label="With helper" placeholder="Bio" helperText="Max 200 characters." />
                  <Textarea label="Error state" placeholder="Description" error="This field is required." />
                  <Textarea label="Full width, 4 rows" placeholder="Leave a comment…" fullWidth rows={4} />
                </div>
              </Preview>
              <PropsTable rows={[
                { name: 'label', type: 'string', def: '—', desc: 'Field label' },
                { name: 'error', type: 'string', def: '—', desc: 'Error message; turns border red' },
                { name: 'helperText', type: 'string', def: '—', desc: 'Hint text below' },
                { name: 'fullWidth', type: 'boolean', def: 'false', desc: 'Stretches to fill container' },
                { name: 'rows', type: 'number', def: '—', desc: 'Initial visible lines' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          {/* ── OVERLAY & INTERACTION ── */}
          <Anchor id="commandpalette">
            <Section title="CommandPalette" subtitle="⌘K search and action launcher · grouped results · keyboard navigation" padded={false}>
              <Code>{`import { CommandPalette } from 'flxtheme';

const [open, setOpen] = useState(false);

<CommandPalette open={open} onOpenChange={setOpen}
  items={[
    { id: 'dashboard', group: 'Navigation', label: 'Go to Dashboard', icon: <FiHome />, shortcut: '⌘1', onSelect: () => navigate('/') },
    { id: 'new',       group: 'Actions',    label: 'New File',        icon: <FiFile />, shortcut: '⌘N', onSelect: handleNewFile },
  ]}
/>
<Button onClick={() => setOpen(true)}>Open palette</Button>`}</Code>
              <Label>Try it</Label>
              <Preview>
                <Button variant="outline" onClick={() => setPaletteOpen(true)}>Open CommandPalette</Button>
                <span className="text-xs text-muted-foreground">or press <kbd className="font-mono bg-muted border border-solid border-border rounded px-1.5 py-0.5">⌘K</kbd></span>
              </Preview>
              <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={COMMANDS} placeholder="Search commands and pages…" />
              <PropsTable rows={[
                { name: 'items', type: 'CommandItem[]', def: '—', desc: 'Array of command items' },
                { name: 'open', type: 'boolean', def: '—', desc: 'Controlled open state' },
                { name: 'onOpenChange', type: 'function', def: '—', desc: 'Called when open changes' },
                { name: 'placeholder', type: 'string', def: "'Search commands…'", desc: 'Input placeholder' },
                { name: 'hotkey', type: 'string', def: "'k'", desc: '⌘/Ctrl + key opens palette' },
                { name: 'item.id', type: 'string', def: '—', desc: 'Unique ID (required)' },
                { name: 'item.label', type: 'string', def: '—', desc: 'Display text (required)' },
                { name: 'item.group', type: 'string', def: '—', desc: 'Group heading' },
                { name: 'item.description', type: 'string', def: '—', desc: 'Secondary line' },
                { name: 'item.icon', type: 'ReactNode', def: '—', desc: 'Icon before label' },
                { name: 'item.shortcut', type: 'string', def: '—', desc: 'Shortcut hint' },
                { name: 'item.onSelect', type: 'function', def: '—', desc: 'Called on selection (required)' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="contextmenu">
            <Section title="ContextMenu" subtitle="Right-click triggered menu · icons · shortcuts · separators · destructive items" padded={false}>
              <Code>{`import { ContextMenu } from 'flxtheme';

<ContextMenu
  items={[
    { label: 'Edit',   icon: <FiEdit />,   shortcut: '⌘E', onClick: handleEdit },
    { type: 'separator' },
    { label: 'Delete', icon: <FiTrash2 />, destructive: true, onClick: handleDelete },
  ]}
>
  <div>Right-click here</div>
</ContextMenu>`}</Code>
              <Label>Try it</Label>
              <Preview>
                <ContextMenu items={[
                  { label: 'Edit', icon: <FiEdit />, shortcut: '⌘E', onClick: () => { } },
                  { label: 'Duplicate', icon: <FiPlus />, shortcut: '⌘D', onClick: () => { } },
                  { label: 'Share', icon: <FiUsers />, onClick: () => { } },
                  { type: 'separator' },
                  { label: 'Settings', icon: <FiSettings />, onClick: () => { } },
                  { type: 'separator' },
                  { label: 'Delete', icon: <FiTrash2 />, shortcut: '⌫', destructive: true, onClick: () => { } },
                ]}>
                  <div className="w-full p-10 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground text-sm cursor-context-menu select-none">
                    Right-click anywhere in this area
                  </div>
                </ContextMenu>
              </Preview>
              <PropsTable rows={[
                { name: 'items', type: 'array', def: '—', desc: 'ContextMenuItem[]' },
                { name: 'children', type: 'ReactNode', def: '—', desc: 'Element that receives right-click' },
                { name: 'item.label', type: 'string', def: '—', desc: 'Item label' },
                { name: 'item.icon', type: 'ReactNode', def: '—', desc: 'Icon before label' },
                { name: 'item.shortcut', type: 'string', def: '—', desc: 'Shortcut hint' },
                { name: 'item.destructive', type: 'boolean', def: 'false', desc: 'Destructive color' },
                { name: 'item.disabled', type: 'boolean', def: 'false', desc: 'Dims and disables' },
                { name: 'item.onClick', type: 'function', def: '—', desc: 'Click handler' },
                { name: "{ type: 'separator' }", type: '—', def: '—', desc: 'Visual divider' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <DrawerSection />
          <Divider />

          <Anchor id="modal">
            <Section title="Modal" subtitle="Dialog overlay — controlled prop or ModalProvider context" padded={false}>
              <Code>{`// ① Controlled
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Confirm" size="md"
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}>
  Dialog content here.
</Modal>

// ② Context-driven
const { openModal, closeModal } = useModal();
<Button onClick={() => openModal('my-modal')}>Open</Button>
<Modal id="my-modal" title="Context Modal"
  footer={<Button onClick={() => closeModal('my-modal')}>Close</Button>}>
  No prop drilling.
</Modal>`}</Code>
              <Preview>
                <Button variant="primary" onClick={() => setControlledModal(true)}>Controlled (open prop)</Button>
                <Modal open={controlledModal} onClose={() => setControlledModal(false)} title="Controlled Modal" size="md"
                  footer={<div className="flex gap-2"><Button variant="ghost" onClick={() => setControlledModal(false)}>Cancel</Button><Button variant="primary" onClick={() => setControlledModal(false)}>Confirm</Button></div>}>
                  <p className="m-0 text-muted-foreground">Driven by the <code>open</code> and <code>onClose</code> props.</p>
                </Modal>
                <ModalContextDemo />
              </Preview>
              <PropsTable rows={[
                { name: 'open', type: 'boolean', def: '—', desc: 'Controlled visibility' },
                { name: 'onClose', type: 'function', def: '—', desc: 'Called on backdrop click or close' },
                { name: 'id', type: 'string', def: '—', desc: 'Registers with ModalProvider' },
                { name: 'title', type: 'string', def: '—', desc: 'Dialog heading' },
                { name: 'size', type: 'string', def: "'md'", desc: 'sm | md | lg | xl | full' },
                { name: 'footer', type: 'ReactNode', def: '—', desc: 'Action buttons footer' },
                { name: 'closeOnOverlay', type: 'boolean', def: 'true', desc: 'Calls onClose on backdrop click' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="popover">
            <Section title="Popover" subtitle="Richer click overlay · 4 sides · 3 alignments · outside-click dismiss" padded={false}>
              <Code>{`import { Popover } from 'flxtheme';

<Popover side="bottom" align="start"
  trigger={<Button variant="outline">Open popover</Button>}>
  <p>Rich content — forms, menus, anything.</p>
</Popover>`}</Code>
              <Preview>
                <Popover side="bottom" align="start" trigger={<Button variant="outline" size="sm">Bottom start</Button>}>
                  <p className="m-0 mb-2 font-semibold text-sm text-foreground">Filter options</p>
                  <p className="m-0 text-xs text-muted-foreground">Any content — inputs, checkboxes, links.</p>
                </Popover>
                <Popover side="bottom" align="end" trigger={<Button variant="secondary" size="sm">Bottom end</Button>}>
                  <p className="m-0 text-sm text-foreground">Aligned to the end of the trigger.</p>
                </Popover>
                <Popover side="top" align="center" trigger={<Button variant="ghost" size="sm">Top center</Button>}>
                  <p className="m-0 text-sm text-foreground">Opens above, centered.</p>
                </Popover>
              </Preview>
              <PropsTable rows={[
                { name: 'trigger', type: 'ReactElement', def: '—', desc: 'Element that opens/closes the popover' },
                { name: 'side', type: 'string', def: "'bottom'", desc: 'top | bottom | left | right' },
                { name: 'align', type: 'string', def: "'start'", desc: 'start | center | end' },
                { name: 'children', type: 'ReactNode', def: '—', desc: 'Popover body content' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <Anchor id="tooltip">
            <Section title="Tooltip" subtitle="Hover label on any element · 4 sides · configurable delay" padded={false}>
              <Code>{`import { Tooltip } from 'flxtheme';

<Tooltip content="Save your work" side="top">
  <Button variant="outline">Hover me</Button>
</Tooltip>`}</Code>
              <Label>Sides</Label>
              <Preview>
                <Tooltip content="Top" side="top"><Button variant="outline" size="sm">Top</Button></Tooltip>
                <Tooltip content="Bottom" side="bottom"><Button variant="outline" size="sm">Bottom</Button></Tooltip>
                <Tooltip content="Left" side="left"><Button variant="outline" size="sm">Left</Button></Tooltip>
                <Tooltip content="Right" side="right"><Button variant="outline" size="sm">Right</Button></Tooltip>
              </Preview>
              <Label>On icon buttons</Label>
              <Preview>
                <Tooltip content="Edit" side="top"><IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" /></Tooltip>
                <Tooltip content="Delete" side="top"><IconButton icon={<FiTrash2 />} aria-label="Delete" variant="ghost" /></Tooltip>
                <Tooltip content="Settings" side="top"><IconButton icon={<FiSettings />} aria-label="Settings" variant="ghost" /></Tooltip>
              </Preview>
              <PropsTable rows={[
                { name: 'content', type: 'ReactNode', def: '—', desc: 'Tooltip content (required)' },
                { name: 'side', type: 'string', def: "'top'", desc: 'top | bottom | left | right' },
                { name: 'delay', type: 'number', def: '300', desc: 'Show delay in ms' },
                { name: 'children', type: 'ReactElement', def: '—', desc: 'Element that triggers the tooltip' },
              ]} />
            </Section>
          </Anchor>
          <Divider />

          <div className="mt-12 px-8 py-10 text-center bg-primary/[0.06] border border-solid border-border rounded-2xl">
            <p className="mb-1.5 font-extrabold text-[1.3rem] text-foreground">27 components documented.</p>
            <p className="mb-6 text-muted-foreground">Wrap your app in <code>&lt;FlxTheme&gt;</code> and <code>&lt;ModalProvider&gt;</code> and you are ready.</p>
            <Button size="lg" variant="primary">npm install flxtheme</Button>
          </div>

        </main>
      </div>
    </div>
  );
}

function DocsApp() {
  return <div className="h-screen bg-background text-foreground"><DocsContent /></div>;
}

export default function App() {
  return (
    <FlxTheme>
      <ModalProvider>
        <ToastProvider defaultDuration={2500}>
          <DocsApp />
        </ToastProvider>
      </ModalProvider>
    </FlxTheme>
  );
}