import { create } from 'zustand';
import { WINDOW_TITLES } from '../data/workspaceData';
import type { AppWindow, LayerBounds, WindowIntent, WindowKind } from '../types/workspace';
import { clamp, getInitialWindowSize, getWindowMinimums } from './workspaceLayout';

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
  updateWindowRect: (
    id: number,
    rect: Partial<Pick<AppWindow, 'width' | 'height' | 'left' | 'top'>>,
    bounds: LayerBounds,
  ) => void;
};

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
            windowItem.id === existing.id
              ? { ...windowItem, zIndex: nextZ, minimized: false }
              : windowItem,
          ),
        };
      }

      const { width, height } = getInitialWindowSize(kind, bounds);

      const index = state.windows.length;
      const centerLeft = (bounds.width - width) / 2;
      const centerTop = (bounds.height - height) / 2;
      const cascadeX = index * 18;
      const cascadeY = index * 14;
      const left = clamp(centerLeft + cascadeX, 12, Math.max(12, bounds.width - width - 12));
      const top = clamp(centerTop + cascadeY, 12, Math.max(12, bounds.height - height - 12));
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

  updateWindowRect: (id, rect, bounds) => {
    set((state) => ({
      windows: state.windows.map((windowItem) => {
        if (windowItem.id !== id || windowItem.maximized) return windowItem;

        const minSize = getWindowMinimums(windowItem.kind);
        const nextWidth = clamp(
          rect.width ?? windowItem.width,
          minSize.width,
          Math.max(minSize.width, bounds.width - 24),
        );
        const nextHeight = clamp(
          rect.height ?? windowItem.height,
          minSize.height,
          Math.max(minSize.height, bounds.height - 24),
        );
        const nextLeft = clamp(
          rect.left ?? windowItem.left,
          12,
          Math.max(12, bounds.width - nextWidth - 12),
        );
        const nextTop = clamp(
          rect.top ?? windowItem.top,
          12,
          Math.max(12, bounds.height - nextHeight - 12),
        );

        return {
          ...windowItem,
          width: nextWidth,
          height: nextHeight,
          left: nextLeft,
          top: nextTop,
        };
      }),
    }));
  },
}));
