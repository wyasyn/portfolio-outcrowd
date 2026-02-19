import { motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';
import type { AppWindow } from '../../types/workspace';

type WorkspaceWindowFrameProps = {
  windowItem: AppWindow;
  dragConstraints: RefObject<HTMLDivElement | null>;
  onBringToFront: (id: number) => void;
  onClose: (id: number) => void;
  onMinimize: (id: number) => void;
  onMaximize: (id: number) => void;
  children: ReactNode;
};

export function WorkspaceWindowFrame({
  windowItem,
  dragConstraints,
  onBringToFront,
  onClose,
  onMinimize,
  onMaximize,
  children,
}: WorkspaceWindowFrameProps) {
  return (
    <motion.article
      key={windowItem.id}
      className={`workspace-window workspace-window-${windowItem.kind}${
        windowItem.maximized ? ' is-maximized' : ''
      }${windowItem.minimized ? ' is-minimized' : ''}`}
      drag={!windowItem.maximized}
      dragConstraints={dragConstraints}
      dragElastic={0.08}
      dragMomentum={false}
      onPointerDown={() => onBringToFront(windowItem.id)}
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
      }}
    >
      <header className="workspace-window-bar">
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
    </motion.article>
  );
}
