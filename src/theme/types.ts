export interface FlxThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  tertiary: string;
  background: string;
  foreground: string;
  surface: string;
  surfaceHover: string;
  border: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveHover: string;
  success: string;
  warning: string;
  info: string;
}

export interface FlxThemeConfig {
  light: FlxThemeColors;
  dark: FlxThemeColors;
  radius?: string;
  fontFamily?: string;
}

export const defaultLightColors: FlxThemeColors = {
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  secondary: '#8b5cf6',
  secondaryHover: '#7c3aed',
  tertiary: '#ec4899',
  background: '#ffffff',
  foreground: '#0f172a',
  surface: '#f8fafc',
  surfaceHover: '#f1f5f9',
  border: '#e2e8f0',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f0abfc',
  accentForeground: '#701a75',
  destructive: '#ef4444',
  destructiveHover: '#dc2626',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const defaultDarkColors: FlxThemeColors = {
  primary: '#818cf8',
  primaryHover: '#6366f1',
  secondary: '#a78bfa',
  secondaryHover: '#8b5cf6',
  tertiary: '#f472b6',
  background: '#0f172a',
  foreground: '#f8fafc',
  surface: '#1e293b',
  surfaceHover: '#334155',
  border: '#334155',
  muted: '#1e293b',
  mutedForeground: '#94a3b8',
  accent: '#c084fc',
  accentForeground: '#f5d0fe',
  destructive: '#f87171',
  destructiveHover: '#ef4444',
  success: '#4ade80',
  warning: '#fbbf24',
  info: '#60a5fa',
};

export const defaultTheme: FlxThemeConfig = {
  light: defaultLightColors,
  dark: defaultDarkColors,
  radius: '0.5rem',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};
