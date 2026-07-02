/**
 * Tailwind preset — register flxtheme's color tokens, radius, font, and
 * keyframe animations into your app's own Tailwind build.
 *
 * usage (tailwind.config.js):
 *   const flxPreset = require('flxtheme/tailwind-preset');
 *   module.exports = {
 *     presets: [flxPreset],
 *     content: [
 *       './src/**\/*.{ts,tsx}',
 *       './node_modules/flxtheme/dist/**\/*.{js,mjs}',
 *     ],
 *   };
 */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--flx-primary)',
        'primary-hover': 'var(--flx-primary-hover)',
        secondary: 'var(--flx-secondary)',
        'secondary-hover': 'var(--flx-secondary-hover)',
        tertiary: 'var(--flx-tertiary)',
        background: 'var(--flx-background)',
        foreground: 'var(--flx-foreground)',
        surface: 'var(--flx-surface)',
        'surface-hover': 'var(--flx-surface-hover)',
        border: 'var(--flx-border)',
        muted: 'var(--flx-muted)',
        'muted-foreground': 'var(--flx-muted-foreground)',
        accent: 'var(--flx-accent)',
        'accent-foreground': 'var(--flx-accent-foreground)',
        destructive: 'var(--flx-destructive)',
        'destructive-hover': 'var(--flx-destructive-hover)',
        success: 'var(--flx-success)',
        warning: 'var(--flx-warning)',
        info: 'var(--flx-info)',
      },
      borderRadius: {
        flx: 'var(--flx-radius)',
      },
      fontFamily: {
        sans: ['var(--flx-font-family)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'flx-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'flx-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'flx-slide-up': {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'flx-spin': 'flx-spin 0.6s linear infinite',
        'flx-fade-in': 'flx-fade-in 0.15s ease-out',
        'flx-slide-up': 'flx-slide-up 0.15s ease-out',
        'flx-modal-fade-in': 'flx-fade-in 0.2s ease-out',
        'flx-modal-slide-up': 'flx-slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
