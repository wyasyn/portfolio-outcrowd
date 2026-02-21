import { motion, useDragControls, useMotionValue } from 'motion/react';
import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react';
import type { AppWindow } from '../../types/workspace';

type WorkspaceWindowFrameProps = {
  windowItem: AppWindow;
  dragConstraints: RefObject<HTMLDivElement | null>;
  onBringToFront: (id: number) => void;
  onClose: (id: number) => void;
  onMinimize: (id: number) => void;
  onMaximize: (id: number) => void;
  onUpdateRect: (id: number, rect: Partial<Pick<AppWindow, 'width' | 'height' | 'left' | 'top'>>) => void;
  children: ReactNode;
};

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_DIRECTIONS: ResizeDirection[] = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function WorkspaceWindowFrame({
  windowItem,
  dragConstraints,
  onBringToFront,
  onClose,
  onMinimize,
  onMaximize,
  onUpdateRect,
  children,
}: WorkspaceWindowFrameProps) {
  const dragControls = useDragControls();
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragStartRef = useRef<{ left: number; top: number }>({
    left: windowItem.left,
    top: windowItem.top,
  });

  const onBarPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (windowItem.maximized || windowItem.minimized) return;
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;
    event.stopPropagation();
    onBringToFront(windowItem.id);
    dragControls.start(event, { snapToCursor: false });
  };

  const onResizeStart = (event: ReactPointerEvent<HTMLDivElement>, direction: ResizeDirection) => {
    if (windowItem.maximized || windowItem.minimized) return;
    const layer = dragConstraints.current;
    if (!layer) return;

    event.preventDefault();
    event.stopPropagation();
    onBringToFront(windowItem.id);

    const bounds = layer.getBoundingClientRect();
    const minWidth = 280;
    const minHeight = 220;
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = windowItem.width;
    const startHeight = windowItem.height;
    const startLeft = windowItem.left;
    const startTop = windowItem.top;
    const startRight = startLeft + startWidth;
    const startBottom = startTop + startHeight;
    const pad = 12;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let width = startWidth + (direction.includes('w') ? -dx : direction.includes('e') ? dx : 0);
      let height = startHeight + (direction.includes('n') ? -dy : direction.includes('s') ? dy : 0);
      width = clamp(width, minWidth, Math.max(minWidth, bounds.width - pad * 2));
      height = clamp(height, minHeight, Math.max(minHeight, bounds.height - pad * 2));

      let left = direction.includes('w') ? startRight - width : startLeft;
      let top = direction.includes('n') ? startBottom - height : startTop;
      left = clamp(left, pad, Math.max(pad, bounds.width - width - pad));
      top = clamp(top, pad, Math.max(pad, bounds.height - height - pad));

      if (direction.includes('w')) {
        width = clamp(startRight - left, minWidth, Math.max(minWidth, bounds.width - left - pad));
      }
      if (direction.includes('n')) {
        height = clamp(startBottom - top, minHeight, Math.max(minHeight, bounds.height - top - pad));
      }

      onUpdateRect(windowItem.id, {
        width,
        height,
        left,
        top,
      });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <motion.article
      key={windowItem.id}
      className={`workspace-window workspace-window-${windowItem.kind}${
        windowItem.maximized ? ' is-maximized' : ''
      }${windowItem.minimized ? ' is-minimized' : ''}`}
      drag={!windowItem.maximized && !windowItem.minimized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      dragElastic={0.08}
      dragMomentum={false}
      onPointerDown={() => onBringToFront(windowItem.id)}
      onDragStart={() => {
        dragStartRef.current = { left: windowItem.left, top: windowItem.top };
      }}
      onDragEnd={() => {
        const nextLeft = dragStartRef.current.left + dragX.get();
        const nextTop = dragStartRef.current.top + dragY.get();
        onUpdateRect(windowItem.id, {
          left: nextLeft,
          top: nextTop,
        });
        dragX.set(0);
        dragY.set(0);
      }}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        width: windowItem.width,
        height: windowItem.height,
        left: windowItem.left,
        top: windowItem.top,
        zIndex: windowItem.zIndex,
        x: dragX,
        y: dragY,
      }}
    >
      <header className="workspace-window-bar" onPointerDown={onBarPointerDown}>
        <div className="workspace-window-controls">
          <button
            type="button"
            className="window-dot window-dot-close"
            onClick={() => onClose(windowItem.id)}
            aria-label={`Close ${windowItem.title} window`}
          />
          <button
            type="button"
            className="window-dot window-dot-minimize"
            onClick={() => onMinimize(windowItem.id)}
            aria-label={`Minimize ${windowItem.title} window`}
          />
          <button
            type="button"
            className="window-dot window-dot-expand"
            onClick={() => onMaximize(windowItem.id)}
            aria-label={`${windowItem.maximized ? 'Restore' : 'Expand'} ${windowItem.title} window`}
          />
        </div>
        <p>{windowItem.title}</p>
        <span />
      </header>

      <div className="workspace-window-body">{children}</div>
      {!windowItem.maximized && !windowItem.minimized
        ? RESIZE_DIRECTIONS.map((direction) => (
            <div
              key={direction}
              className={`workspace-resize-handle workspace-resize-handle-${direction}`}
              onPointerDown={(event) => onResizeStart(event, direction)}
              role="presentation"
            />
          ))
        : null}
    </motion.article>
  );
}
