import { createContext } from 'react';

export interface ThemeContextType {
  mode: string;
  colorTheme: string | null;
  setMode: (mode: string) => void;
  setColorTheme: (theme: string | null) => void;
  setTheme: (theme: string) => void;
}

export const ThemeProviderContext = createContext<ThemeContextType | undefined>(undefined);