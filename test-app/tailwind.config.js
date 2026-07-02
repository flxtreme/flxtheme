import flxPreset from 'flxtheme/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [flxPreset],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/flxtheme/dist/**/*.{js,mjs}',
  ],
};
