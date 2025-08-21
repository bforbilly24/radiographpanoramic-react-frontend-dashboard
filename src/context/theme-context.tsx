import { useEffect, useState, ReactNode } from 'react';
import { ThemeProviderContext, ThemeContextType } from './theme-context-definition';

export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultColorTheme = null,
  storageKeyMode = 'vite-ui-mode',
  storageKeyColorTheme = 'vite-ui-color-theme',
}: {
  children: ReactNode;
  defaultMode?: string;
  defaultColorTheme?: string | null;
  storageKeyMode?: string;
  storageKeyColorTheme?: string;
}) {
  const [mode, setMode] = useState<string>(
    () => localStorage.getItem(storageKeyMode) || defaultMode
  );

  const [colorTheme, setColorTheme] = useState<string | null>(
    () => localStorage.getItem(storageKeyColorTheme) || defaultColorTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Set mode classes
    root.classList.remove('light', 'dark');
    if (mode === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemMode);
    } else {
      root.classList.add(mode);
    }
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply color theme
    if (colorTheme) {
      root.setAttribute('data-theme', colorTheme);
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(storageKeyColorTheme, colorTheme || '');
  }, [colorTheme, storageKeyColorTheme]);

  useEffect(() => {
    localStorage.setItem(storageKeyMode, mode);
  }, [mode, storageKeyMode]);

  const setTheme = (theme: string) => {
    setMode(theme);
  };

  const value: ThemeContextType = {
    mode,
    colorTheme,
    setMode,
    setColorTheme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export default ThemeProvider;