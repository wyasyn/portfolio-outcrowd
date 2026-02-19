import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

type NavStore = {
  themeMode: ThemeMode;
  isThemeOpen: boolean;
  isMobileNavOpen: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeOpen: () => void;
  closeTheme: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
};

function getInitialThemeMode(): ThemeMode {
  const stored = localStorage.getItem('theme-mode');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export const useNavStore = create<NavStore>((set) => ({
  themeMode: getInitialThemeMode(),
  isThemeOpen: false,
  isMobileNavOpen: false,
  setThemeMode: (mode) => set(() => ({ themeMode: mode })),
  toggleThemeOpen: () => set((state) => ({ isThemeOpen: !state.isThemeOpen })),
  closeTheme: () => set(() => ({ isThemeOpen: false })),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  closeMobileNav: () => set(() => ({ isMobileNavOpen: false })),
}));
