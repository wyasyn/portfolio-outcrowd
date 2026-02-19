import { create } from 'zustand';
import { WINDOW_TITLES } from '../data/workspaceData';
import type { AppWindow, LayerBounds, WindowIntent, WindowKind } from '../types/workspace';

type WorkspaceState = {
  intent: WindowIntent | null;
  intentNonce: number;
  windows: AppWindow[];
  nextId: number;
  zIndex: number;
  requestWindow: (kind: WindowKind) => void;
  closeAllWindows: () => void;
  openOrFocusWindow: (kind: WindowKind, bounds: LayerBounds) => void;
  closeWindow: (id: number) => void;
  bringToFront: (id: number) => void;
  toggleMinimize: (id: number) => void;
  toggleMaximize: (id: number, bounds: LayerBounds) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  intent: null,
  intentNonce: 0,
  windows: [],
  nextId: 1,
  zIndex: 20,

  requestWindow: (kind) => {
    set((state) => {
      const nextNonce = state.intentNonce + 1;
      return {
        intentNonce: nextNonce,
        intent: { kind, nonce: nextNonce },
      };
    });
  },

  closeAllWindows: () => {
    set(() => ({ windows: [] }));
  },

  openOrFocusWindow: (kind, bounds) => {
    set((state) => {
      const existing = state.windows.find((windowItem) => windowItem.kind === kind);

      if (existing) {
        const nextZ = state.zIndex + 1;
        return {
          zIndex: nextZ,
          windows: state.windows.map((windowItem) =>
            windowItem.id === existing.id ? { ...windowItem, zIndex: nextZ, minimized: false } : windowItem,
          ),
        };
      }

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

      const index = state.windows.length;
      const left = clamp(42 + index * 24, 12, Math.max(12, bounds.width - width - 12));
      const top = clamp(60 + index * 18, 12, Math.max(12, bounds.height - height - 12));
      const nextZ = state.zIndex + 1;

      const newWindow: AppWindow = {
        id: state.nextId,
        kind,
        title: WINDOW_TITLES[kind],
        width,
        height,
        left,
        top,
        zIndex: nextZ,
        minimized: false,
        maximized: false,
        restoreRect: null,
      };

      return {
        windows: [...state.windows, newWindow],
        nextId: state.nextId + 1,
        zIndex: nextZ,
      };
    });
  },

  closeWindow: (id) => {
    set((state) => ({ windows: state.windows.filter((windowItem) => windowItem.id !== id) }));
  },

  bringToFront: (id) => {
    set((state) => {
      const nextZ = state.zIndex + 1;
      return {
        zIndex: nextZ,
        windows: state.windows.map((windowItem) =>
          windowItem.id === id ? { ...windowItem, zIndex: nextZ } : windowItem,
        ),
      };
    });
  },

  toggleMinimize: (id) => {
    set((state) => ({
      windows: state.windows.map((windowItem) =>
        windowItem.id === id
          ? {
              ...windowItem,
              minimized: !windowItem.minimized,
              maximized: false,
            }
          : windowItem,
      ),
    }));
  },

  toggleMaximize: (id, bounds) => {
    set((state) => {
      const fitRect = {
        left: 10,
        top: 10,
        width: Math.max(260, bounds.width - 20),
        height: Math.max(200, bounds.height - 20),
      };

      return {
        windows: state.windows.map((windowItem) => {
          if (windowItem.id !== id) return windowItem;

          if (windowItem.maximized && windowItem.restoreRect) {
            return {
              ...windowItem,
              ...windowItem.restoreRect,
              maximized: false,
              minimized: false,
              restoreRect: null,
            };
          }

          return {
            ...windowItem,
            ...fitRect,
            maximized: true,
            minimized: false,
            restoreRect: {
              width: windowItem.width,
              height: windowItem.height,
              left: windowItem.left,
              top: windowItem.top,
            },
          };
        }),
      };
    });
  },
}));
