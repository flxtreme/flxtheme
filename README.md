# flxtheme

A React component library and theming system built for modern dashboards and web applications. **flxtheme** provides a cohesive set of UI primitives powered by a centralized design token system—change your brand colors, typography, or border radius in one place and every component updates automatically.

## Links

* 🌐 **Preview:** https://flxtreme.github.io/flxtheme/
* 📦 **npm:** https://www.npmjs.com/package/flxtheme
* 💻 **GitHub:** https://github.com/flxtreme/flxtheme

## Features

* 🎨 Centralized theming with light and dark mode support
* 🧩 Reusable React UI components
* 📐 Design tokens exposed as CSS variables
* 📦 Built with TypeScript
* ⚡ Minimal setup with sensible defaults
* 🌙 Runtime theme switching without hydration issues
* 🪟 Context-based modal management
* 📱 Suitable for dashboards, SaaS applications, internal tools, and customer-facing products

## Installation

```bash
npm install flxtheme
```

**Requirements**

* React 18 or later

## Quick Start

Wrap your application with `FlxTheme` to make the theme available to every component.

```tsx
import { FlxTheme } from "flxtheme";

export default function App() {
  return (
    <FlxTheme defaultMode="light">
      <YourApp />
    </FlxTheme>
  );
}
```

## Custom Themes

Create your own `FlxThemeConfig` to customize colors, typography, and border radius.

```tsx
import { FlxTheme } from "flxtheme";
import type { FlxThemeConfig } from "flxtheme";

const theme: FlxThemeConfig = {
  light: {
    primary: "#0ea5e9",
    primaryHover: "#0284c7",
    // ...other tokens
  },
  dark: {
    primary: "#38bdf8",
    primaryHover: "#0ea5e9",
    // ...other tokens
  },
  radius: "0.375rem",
  fontFamily: "'Geist', system-ui, sans-serif",
};

export default function App() {
  return (
    <FlxTheme theme={theme}>
      <YourApp />
    </FlxTheme>
  );
}
```

## Design Tokens

Every theme value is exposed as a CSS variable prefixed with `--flx-`, allowing your own styles to stay consistent with the active theme.

| Token                    | Description                   |
| ------------------------ | ----------------------------- |
| `--flx-primary`          | Primary brand color           |
| `--flx-primary-hover`    | Primary hover color           |
| `--flx-secondary`        | Secondary accent color        |
| `--flx-background`       | Application background        |
| `--flx-foreground`       | Primary text color            |
| `--flx-surface`          | Cards and surface backgrounds |
| `--flx-border`           | Borders and dividers          |
| `--flx-muted`            | Muted backgrounds             |
| `--flx-muted-foreground` | Secondary text color          |
| `--flx-success`          | Success color                 |
| `--flx-warning`          | Warning color                 |
| `--flx-info`             | Information color             |
| `--flx-destructive`      | Error and destructive actions |
| `--flx-radius`           | Global border radius          |
| `--flx-font-family`      | Global font family            |

Example:

```css
.custom-card {
  background: var(--flx-surface);
  color: var(--flx-foreground);
  border: 1px solid var(--flx-border);
  border-radius: var(--flx-radius);
}
```

## Modal System

flxtheme includes a built-in context-based modal manager. Wrap your application once with `ModalProvider`, then open or close modals from anywhere using the `useModal()` hook.

```tsx
import {
  ModalProvider,
  Modal,
  useModal,
} from "flxtheme";

function DeleteButton() {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal("confirm-delete")}>
      Delete
    </button>
  );
}

export default function App() {
  return (
    <ModalProvider>
      <DeleteButton />

      <Modal
        id="confirm-delete"
        title="Delete Item"
      >
        Are you sure?
      </Modal>
    </ModalProvider>
  );
}
```

## Use Cases

flxtheme is well suited for:

* Admin dashboards
* SaaS platforms
* Internal business tools
* CRM and ERP systems
* Analytics dashboards
* Customer-facing web applications
* Rapid UI prototyping

## License

MIT
