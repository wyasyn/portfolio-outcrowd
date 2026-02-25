import { useEffect } from 'react';
import type { ThemeMode } from '../stores/navStore';

function getResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useThemeMode(mode: ThemeMode) {
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = (nextMode: ThemeMode) => {
      root.dataset.theme = getResolvedTheme(nextMode);
      root.dataset.themeMode = nextMode;
      localStorage.setItem('theme-mode', nextMode);
    };

    apply(mode);

    if (mode !== 'system') return;

    const handleChange = () => apply('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);
}
