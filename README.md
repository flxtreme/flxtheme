# flxtheme

A React component library and theming system built for modern dashboards and web applications. flxtheme gives you a cohesive set of UI primitives wired to a single design token layer — swap your brand colors, radius, and typography in one place and every component updates automatically.

## What it's for

flxtheme is designed for teams who want to ship polished interfaces quickly without writing CSS from scratch. It provides the building blocks — layout, navigation, forms, data display, and overlays — with sensible defaults that stay out of your way and a theme system that scales as your product grows.

It works equally well for internal tools, admin dashboards, SaaS products, and customer-facing apps.

## How theming works

Wrap your app in `<FlxTheme>` and every component pulls its colors, radius, and font family from CSS variables on the root element. You can pass a custom theme config or use the built-in defaults. Light and dark modes are handled automatically — toggle between them at runtime with no flash or hydration issues.

```tsx
import { FlxTheme } from 'flxtheme';

export default function App() {
  return (
    <FlxTheme defaultMode="light" theme={yourTheme}>
      <YourApp />
    </FlxTheme>
  );
}
```

To customize, define your own `FlxThemeConfig` with `light` and `dark` color sets plus optional `radius` and `fontFamily` overrides.

```tsx
import { FlxTheme } from 'flxtheme';
import type { FlxThemeConfig } from 'flxtheme';

const theme: FlxThemeConfig = {
  light: {
    primary: '#0ea5e9',
    primaryHover: '#0284c7',
    // ... other tokens
  },
  dark: {
    primary: '#38bdf8',
    primaryHover: '#0ea5e9',
    // ... other tokens
  },
  radius: '0.375rem',
  fontFamily: "'Geist', system-ui, sans-serif",
};

<FlxTheme theme={theme}>...</FlxTheme>
```

## Design tokens

All tokens are exposed as CSS variables prefixed with `--flx-`. You can use them in your own styles to stay consistent with the theme:

| Token | Purpose |
|---|---|
| `--flx-primary` | Brand primary color |
| `--flx-secondary` | Secondary accent |
| `--flx-background` | Page background |
| `--flx-foreground` | Default text color |
| `--flx-surface` | Card and panel backgrounds |
| `--flx-border` | Borders and dividers |
| `--flx-muted` | Subtle backgrounds |
| `--flx-muted-foreground` | Dimmed text |
| `--flx-destructive` | Error and danger states |
| `--flx-success` | Positive feedback |
| `--flx-warning` | Caution states |
| `--flx-info` | Informational states |
| `--flx-radius` | Global border radius |
| `--flx-font-family` | Global font stack |

## Modal system

flxtheme includes a context-based modal manager. Wrap your app in `<ModalProvider>` once and open or close any modal from anywhere in the tree using the `useModal()` hook — no prop drilling, no portal wiring.

```tsx
import { ModalProvider, Modal, useModal } from 'flxtheme';

// In a deeply nested component:
const { openModal } = useModal();
<button onClick={() => openModal('confirm')}>Delete</button>

// Anywhere in the tree:
<Modal id="confirm" title="Are you sure?">...</Modal>
```

## Installation

```bash
npm install flxtheme
```

Requires React 18+.

## License

MIT