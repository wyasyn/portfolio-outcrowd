import type { ThemeMode } from '../stores/navStore';

export const NAV_ITEMS = ['Home', 'About', 'Projects', 'Contact'] as const;

export const THEME_OPTIONS: ReadonlyArray<{
  value: ThemeMode;
  label: string;
  triggerLabel: string;
  hint: string;
  emoji: string;
}> = [
  { value: 'light', label: 'Light mode', triggerLabel: 'Light', hint: 'Bright UI', emoji: '☀️' },
  { value: 'dark', label: 'Dark mode', triggerLabel: 'Dark', hint: 'Low light', emoji: '🌙' },
  { value: 'system', label: 'System', triggerLabel: 'System', hint: 'Use OS setting', emoji: '🖥️' },
];
