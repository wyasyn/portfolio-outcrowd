import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { useId, type RefObject } from 'react';
import { THEME_OPTIONS } from '../../data/navigationData';
import type { ThemeMode } from '../../stores/navStore';
import { Icon } from '../ui/Icon';

type ThemePickerProps = {
  isThemeOpen: boolean;
  themeMode: ThemeMode;
  themePickerRef: RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onSelect: (mode: ThemeMode) => void;
};

export function ThemePicker({
  isThemeOpen,
  themeMode,
  themePickerRef,
  onToggle,
  onSelect,
}: ThemePickerProps) {
  const themePickerId = useId();
  const triggerId = `${themePickerId}-trigger`;
  const panelId = `${themePickerId}-panel`;
  const activeThemeOption =
    THEME_OPTIONS.find((option) => option.value === themeMode) ?? THEME_OPTIONS[2];

  return (
    <div className="theme-picker" ref={themePickerRef}>
      <span className="sr-only">Select theme mode</span>
      {isThemeOpen ? (
        <button
          type="button"
          className="theme-trigger is-open"
          aria-label="Theme mode"
          aria-expanded="true"
          aria-haspopup="listbox"
          aria-controls={panelId}
          id={triggerId}
          onClick={onToggle}
        >
          <span className="theme-trigger-value">
            <span>{activeThemeOption.emoji}</span>
            <span>{activeThemeOption.triggerLabel}</span>
          </span>
          <span className="theme-trigger-chevron" aria-hidden="true">
            <Icon icon={ArrowUp01Icon} size={14} />
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="theme-trigger"
          aria-label="Theme mode"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-controls={panelId}
          id={triggerId}
          onClick={onToggle}
        >
          <span className="theme-trigger-value">
            <span>{activeThemeOption.emoji}</span>
            <span>{activeThemeOption.triggerLabel}</span>
          </span>
          <span className="theme-trigger-chevron" aria-hidden="true">
            <Icon icon={ArrowDown01Icon} size={14} />
          </span>
        </button>
      )}

      {isThemeOpen ? (
        <motion.div
          className="theme-panel"
          id={panelId}
          role="listbox"
          aria-labelledby={triggerId}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={themeMode === option.value}
              className={`theme-option ${themeMode === option.value ? 'is-selected' : ''}`}
              onClick={() => onSelect(option.value)}
            >
              <span className="theme-option-main">
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </span>
              <span className="theme-option-hint">{option.hint}</span>
              <span className="theme-option-check" aria-hidden="true">
                {themeMode === option.value ? <Icon icon={Tick02Icon} size={14} /> : null}
              </span>
            </button>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}
