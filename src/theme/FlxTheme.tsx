import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FlxThemeConfig, FlxThemeColors, defaultTheme } from './types';

type ThemeMode = 'light' | 'dark';

interface FlxThemeContextValue {
  theme: FlxThemeConfig;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  colors: FlxThemeColors;
}

const FlxThemeContext = createContext<FlxThemeContextValue | undefined>(undefined);

export function useFlxTheme(): FlxThemeContextValue {
  const ctx = useContext(FlxThemeContext);
  if (!ctx) {
    throw new Error('useFlxTheme must be used within a <FlxTheme> provider');
  }
  return ctx;
}

function colorsToVars(colors: FlxThemeColors): Record<string, string> {
  return {
    '--flx-primary': colors.primary,
    '--flx-primary-hover': colors.primaryHover,
    '--flx-secondary': colors.secondary,
    '--flx-secondary-hover': colors.secondaryHover,
    '--flx-tertiary': colors.tertiary,
    '--flx-background': colors.background,
    '--flx-foreground': colors.foreground,
    '--flx-surface': colors.surface,
    '--flx-surface-hover': colors.surfaceHover,
    '--flx-border': colors.border,
    '--flx-muted': colors.muted,
    '--flx-muted-foreground': colors.mutedForeground,
    '--flx-accent': colors.accent,
    '--flx-accent-foreground': colors.accentForeground,
    '--flx-destructive': colors.destructive,
    '--flx-destructive-hover': colors.destructiveHover,
    '--flx-success': colors.success,
    '--flx-warning': colors.warning,
    '--flx-info': colors.info,
  };
}

export interface FlxThemeProps {
  theme?: FlxThemeConfig;
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

export function FlxTheme({ theme = defaultTheme, defaultMode = 'light', children }: FlxThemeProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const colors = mode === 'light' ? theme.light : theme.dark;

  const cssVars = useMemo(() => {
    const vars = colorsToVars(colors);
    vars['--flx-radius'] = theme.radius || '0.5rem';
    vars['--flx-font-family'] = theme.fontFamily || "'Inter', system-ui, sans-serif";
    return vars;
  }, [colors, theme.radius, theme.fontFamily]);

  const ctxValue = useMemo<FlxThemeContextValue>(
    () => ({ theme, mode, toggleMode, setMode, colors }),
    [theme, mode, toggleMode, colors]
  );

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <FlxThemeContext.Provider value={ctxValue}>
      <div
        className="flx-theme-root"
        style={cssVars as React.CSSProperties}
        data-theme={mode}
      >
        {children}
      </div>
    </FlxThemeContext.Provider>
  );
}
