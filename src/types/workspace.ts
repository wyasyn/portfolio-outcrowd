export type WindowKind = 'about' | 'projects' | 'contact';

export type WindowIntent = {
  kind: WindowKind;
  nonce: number;
};

export type AppWindow = {
  id: number;
  kind: WindowKind;
  title: string;
  width: number;
  height: number;
  left: number;
  top: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  restoreRect: null | {
    width: number;
    height: number;
    left: number;
    top: number;
  };
};

export type LayerBounds = {
  width: number;
  height: number;
};
