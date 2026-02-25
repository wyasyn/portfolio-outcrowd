import type { LayerBounds, WindowKind } from '../types/workspace';

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getWindowMinimums(kind: WindowKind) {
  if (kind === 'about') return { width: 340, height: 240 };
  if (kind === 'projects') return { width: 360, height: 300 };
  return { width: 360, height: 320 };
}

export function getInitialWindowSize(kind: WindowKind, bounds: LayerBounds) {
  const isNarrowViewport = bounds.width <= 760;
  const isAboutWindow = kind === 'about';
  const isProjectsWindow = kind === 'projects';
  const isContactWindow = kind === 'contact';

  const width = isAboutWindow
    ? Math.min(720, Math.max(340, bounds.width * 0.72))
    : isProjectsWindow
      ? Math.min(860, Math.max(360, bounds.width * 0.78))
      : isContactWindow
        ? Math.min(900, Math.max(360, bounds.width * 0.8))
        : Math.min(520, Math.max(290, bounds.width * 0.56));

  const height = isNarrowViewport
    ? Math.min(460, Math.max(280, bounds.height * 0.62))
    : isProjectsWindow
      ? Math.min(520, Math.max(300, bounds.height * 0.68))
      : isContactWindow
        ? Math.min(540, Math.max(320, bounds.height * 0.7))
        : Math.min(390, Math.max(240, bounds.height * 0.52));

  return { width, height };
}
