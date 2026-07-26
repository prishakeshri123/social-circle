import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useUiStore } from '@/store/uiSlice';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
