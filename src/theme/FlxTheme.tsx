import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type ThemeMode = 'light' | 'dark';

interface FlxThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const FlxThemeContext = createContext<FlxThemeContextValue | undefined>(undefined);

export function useFlxTheme(): FlxThemeContextValue {
  const ctx = useContext(FlxThemeContext);
  if (!ctx) {
    throw new Error('useFlxTheme must be used within a <FlxTheme> provider');
  }
  return ctx;
}

export interface FlxThemeProps {
  defaultMode?: ThemeMode;
  children: React.ReactNode;
}

/**
 * All color/radius/font tokens live in flxtheme.css (Tailwind v4 @theme block),
 * generated via `npx flxtheme init`. FlxTheme only toggles the `.dark` class.
 */
export function FlxTheme({ defaultMode = 'light', children }: FlxThemeProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const ctxValue = useMemo<FlxThemeContextValue>(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode]
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
      <div className="flx-theme-root" data-theme={mode}>
        {children}
      </div>
    </FlxThemeContext.Provider>
  );
}