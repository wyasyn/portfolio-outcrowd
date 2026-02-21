import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import type { WindowKind } from '../../types/workspace';
import { AboutWindowContent } from './content/AboutWindowContent';
import { ContactWindowContent } from './content/ContactWindowContent';
import { ProjectsWindowContent } from './content/ProjectsWindowContent';
import { WorkspaceWindowFrame } from './WorkspaceWindowFrame';

function renderWindowContent(kind: WindowKind) {
  if (kind === 'about') return <AboutWindowContent />;
  if (kind === 'projects') return <ProjectsWindowContent />;
  return <ContactWindowContent />;
}

export function WorkspaceWindows() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  const {
    intent,
    windows,
    openOrFocusWindow,
    closeWindow,
    bringToFront,
    toggleMinimize,
    toggleMaximize,
    updateWindowRect,
  } = useWorkspaceStore(
    useShallow((state) => ({
      intent: state.intent,
      windows: state.windows,
      openOrFocusWindow: state.openOrFocusWindow,
      closeWindow: state.closeWindow,
      bringToFront: state.bringToFront,
      toggleMinimize: state.toggleMinimize,
      toggleMaximize: state.toggleMaximize,
      updateWindowRect: state.updateWindowRect,
    })),
  );

  const intentKind = intent?.kind;
  const intentNonce = intent?.nonce;

  useEffect(() => {
    if (!intentKind) return;

    const layer = layerRef.current;
    if (!layer) return;

    const bounds = layer.getBoundingClientRect();
    openOrFocusWindow(intentKind, {
      width: bounds.width,
      height: bounds.height,
    });
  }, [intentKind, intentNonce, openOrFocusWindow]);

  const sortedWindows = useMemo(() => [...windows].sort((a, b) => a.zIndex - b.zIndex), [windows]);

  const onToggleMaximize = (id: number) => {
    const layer = layerRef.current;
    if (!layer) return;
    const bounds = layer.getBoundingClientRect();
    toggleMaximize(id, {
      width: bounds.width,
      height: bounds.height,
    });
  };

  const onUpdateRect = (id: number, rect: { width?: number; height?: number; left?: number; top?: number }) => {
    const layer = layerRef.current;
    if (!layer) return;
    const bounds = layer.getBoundingClientRect();
    updateWindowRect(id, rect, {
      width: bounds.width,
      height: bounds.height,
    });
  };

  const renderedWindows = sortedWindows.map((windowItem) => (
    <WorkspaceWindowFrame
      key={windowItem.id}
      windowItem={windowItem}
      dragConstraints={layerRef}
      onBringToFront={bringToFront}
      onClose={closeWindow}
      onMinimize={toggleMinimize}
      onMaximize={onToggleMaximize}
      onUpdateRect={onUpdateRect}
    >
      {renderWindowContent(windowItem.kind)}
    </WorkspaceWindowFrame>
  ));

  if (windows.length === 0) {
    return (
      <div className="workspace-layer" ref={layerRef} aria-hidden="true">
        {renderedWindows}
      </div>
    );
  }

  return (
    <div className="workspace-layer" ref={layerRef} aria-hidden="false">
      {renderedWindows}
    </div>
  );
}
