import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { THEME_OPTIONS } from '../../data/navigationData';
import type { ThemeMode } from '../../stores/navStore';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { BrandMark } from './BrandMark';

type MobileDrawerProps = {
  isMobileNavOpen: boolean;
  items: readonly string[];
  brandName: string;
  ctaLabel: string;
  themeMode: ThemeMode;
  onClose: () => void;
  onItemSelect?: (item: string) => void;
  onThemeSelect: (mode: ThemeMode) => void;
  onCtaClick?: () => void;
};

export function MobileDrawer({
  isMobileNavOpen,
  items,
  brandName,
  ctaLabel,
  themeMode,
  onClose,
  onItemSelect,
  onThemeSelect,
  onCtaClick,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavOpen, onClose]);

  return (
    <AnimatePresence>
      {isMobileNavOpen ? (
        <motion.div
          className="mobile-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.aside
            id="mobile-navigation-drawer"
            ref={drawerRef}
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            tabIndex={-1}
            initial={{ x: -26, opacity: 0.98 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -26, opacity: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <a className="brand" href="/">
                <BrandMark />
                <span>{brandName}</span>
              </a>
              <button className="mobile-close" type="button" aria-label="Close menu" onClick={onClose}>
                <Icon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Mobile navigation">
              {items.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onItemSelect?.(item);
                    onClose();
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-theme-row" role="group" aria-label="Theme mode">
                {THEME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`mobile-theme-pill ${themeMode === option.value ? 'is-selected' : ''}`}
                    onClick={() => onThemeSelect(option.value)}
                  >
                    <span>{option.emoji}</span>
                    <span>{option.triggerLabel}</span>
                  </button>
                ))}
              </div>

              <Button
                className="mobile-nav-cta"
                onClick={() => {
                  onCtaClick?.();
                  onClose();
                }}
              >
                {ctaLabel}
              </Button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
