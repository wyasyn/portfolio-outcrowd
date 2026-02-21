import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useShallow } from 'zustand/react/shallow';
import { useNavStore, type ThemeMode } from '../../stores/navStore';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { Button } from '../ui/Button';
import { BrandMark } from './BrandMark';
import { MobileDrawer } from './MobileDrawer';
import { MobileMenuButton } from './MobileMenuButton';
import { ThemePicker } from './ThemePicker';

type TopNavProps = {
  items: readonly string[];
  brandName: string;
  ctaLabel: string;
  onItemSelect?: (item: string) => void;
  onCtaClick?: () => void;
};

function getResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function TopNav({ items, brandName, ctaLabel, onItemSelect, onCtaClick }: TopNavProps) {
  const {
    themeMode,
    isThemeOpen,
    isMobileNavOpen,
    setThemeMode,
    toggleThemeOpen,
    closeTheme,
    toggleMobileNav,
    closeMobileNav,
  } = useNavStore(
    useShallow((state) => ({
      themeMode: state.themeMode,
      isThemeOpen: state.isThemeOpen,
      isMobileNavOpen: state.isMobileNavOpen,
      setThemeMode: state.setThemeMode,
      toggleThemeOpen: state.toggleThemeOpen,
      closeTheme: state.closeTheme,
      toggleMobileNav: state.toggleMobileNav,
      closeMobileNav: state.closeMobileNav,
    })),
  );
  const themePickerRef = useRef<HTMLDivElement | null>(null);
  const activeWindowKind = useWorkspaceStore((state) => {
    let activeKind: 'about' | 'projects' | 'contact' | null = null;
    let highestZ = -Infinity;

    for (const windowItem of state.windows) {
      if (windowItem.minimized) continue;
      if (windowItem.zIndex > highestZ) {
        highestZ = windowItem.zIndex;
        activeKind = windowItem.kind;
      }
    }

    return activeKind;
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = (mode: ThemeMode) => {
      root.dataset.theme = getResolvedTheme(mode);
      root.dataset.themeMode = mode;
      localStorage.setItem('theme-mode', mode);
    };

    apply(themeMode);

    if (themeMode !== 'system') return;

    const handleChange = () => apply('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!themePickerRef.current) return;
      if (!themePickerRef.current.contains(event.target as Node)) {
        closeTheme();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeTheme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) closeMobileNav();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [closeMobileNav]);

  useEffect(() => {
    if (!isThemeOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeTheme();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isThemeOpen, closeTheme]);

  return (
    <motion.header
      className="top-nav"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.8 }}
    >
      <a className="brand" href="/">
        <BrandMark />
        <span>{brandName}</span>
      </a>

      <nav className="top-nav-links" aria-label="Main navigation">
        {items.map((item) => (
          <motion.button
            type="button"
            key={item}
            className={item.toLowerCase() === activeWindowKind ? 'is-active' : undefined}
            aria-pressed={item.toLowerCase() === activeWindowKind}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            onClick={() => onItemSelect?.(item)}
          >
            {item}
          </motion.button>
        ))}
      </nav>

      <div className="top-nav-actions">
        <ThemePicker
          isThemeOpen={isThemeOpen}
          themeMode={themeMode}
          themePickerRef={themePickerRef}
          onToggle={toggleThemeOpen}
          onSelect={(mode) => {
            setThemeMode(mode);
            closeTheme();
          }}
        />

        <Button variant="primary" onClick={onCtaClick}>
          {ctaLabel}
        </Button>

        <MobileMenuButton isMobileNavOpen={isMobileNavOpen} onToggle={toggleMobileNav} />
      </div>

      <MobileDrawer
        isMobileNavOpen={isMobileNavOpen}
        items={items}
        brandName={brandName}
        ctaLabel={ctaLabel}
        themeMode={themeMode}
        onClose={closeMobileNav}
        onItemSelect={onItemSelect}
        onThemeSelect={setThemeMode}
        onCtaClick={onCtaClick}
      />
    </motion.header>
  );
}
