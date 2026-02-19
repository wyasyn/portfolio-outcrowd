import type { ReactNode, RefObject } from 'react';
import {
  CheckmarkSquare01Icon,
  Clock01Icon,
  PinLocation01Icon,
  PythonIcon,
  ReactIcon,
  Task01Icon,
} from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { Icon } from './ui/Icon';

type TaskProgressProps = {
  title: string;
  progress: number;
};

type AnimatedCardProps = {
  children: ReactNode;
  className: string;
  floatY: number;
  rotate: number;
  delay: number;
  dragConstraints: RefObject<HTMLElement | null>;
};

type HeroDecorationsProps = {
  dragConstraints: RefObject<HTMLElement | null>;
};

function FlutterLogo() {
  return (
    <svg viewBox="0 0 24 24" width="25" height="25" aria-hidden focusable="false">
      <path d="M4.5 14.1 12.9 5.7h5.3L9.8 14.1z" fill="#47C5FB" />
      <path d="M9.8 22.2 18.2 13.8h-5.3L4.5 22.2z" fill="#47C5FB" />
      <path d="m12.9 19.6 2.6-2.6 2.7 2.6-2.7 2.6z" fill="#00569E" />
      <path d="m9.8 17 3.1-3.1h5.3L15 17l3.2 3.2h-5.3z" fill="#00B5F8" />
    </svg>
  );
}

function AnimatedCard({ children, className, floatY, rotate, delay, dragConstraints }: AnimatedCardProps) {
  return (
    <motion.article
      className={`floating-card ${className}`}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.16}
      dragMomentum={false}
      whileDrag={{ cursor: 'grabbing', scale: 1.02, zIndex: 3 }}
      initial={{ opacity: 0, y: 14, scale: 0.98, rotate: rotate - 1 }}
      animate={{
        opacity: 1,
        y: [0, -floatY, 0],
        scale: 1,
        rotate: [rotate, rotate + 0.6, rotate],
      }}
      transition={{
        opacity: { duration: 0.45, delay, ease: 'easeOut' },
        scale: { type: 'spring', stiffness: 170, damping: 20, delay },
        y: {
          duration: 6.4,
          delay: delay + 0.45,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
        rotate: {
          duration: 7.2,
          delay: delay + 0.45,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
      }}
      whileHover={{ y: -4, scale: 1.015, rotate }}
      whileTap={{ scale: 0.995 }}
      style={{ transformOrigin: 'center center' }}
    >
      {children}
    </motion.article>
  );
}

function StickyNoteCard({ dragConstraints }: HeroDecorationsProps) {
  return (
    <AnimatedCard className="sticky-note-card" floatY={4} rotate={4} delay={0.1} dragConstraints={dragConstraints}>
      <span className="pin-head" aria-hidden />
      <Icon icon={PinLocation01Icon} size={12} className="pin-icon" />
      <p>Ship clear UI. Keep every detail sharp.</p>
      <span className="sticky-action" aria-hidden>
        <Icon icon={CheckmarkSquare01Icon} size={20} color="#ffffff" />
      </span>
    </AnimatedCard>
  );
}

function ReminderCard({ dragConstraints }: HeroDecorationsProps) {
  return (
    <AnimatedCard className="reminder-card" floatY={5} rotate={7} delay={0.2} dragConstraints={dragConstraints}>
      <div className="reminder-clock" aria-hidden>
        <Icon icon={Clock01Icon} size={18} />
      </div>
      <div className="reminder-head">
        <p className="card-label">Sprint</p>
        <span>Critical</span>
      </div>
      <p className="card-title">Hospital Triage Dashboard</p>
      <p className="card-subtitle">Stabilize live patient queue + failover UI</p>
      <div className="reminder-time">
        <Icon icon={Clock01Icon} size={14} />
        <span>06:30 - 09:00</span>
      </div>
    </AnimatedCard>
  );
}

function ProgressRow({ title, progress }: TaskProgressProps) {
  return (
    <div className="task-row">
      <div className="task-line">
        <span>{title}</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-rail" role="presentation">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="task-date">Sep 10</span>
    </div>
  );
}

function TasksCard({ dragConstraints }: HeroDecorationsProps) {
  return (
    <AnimatedCard className="tasks-card" floatY={6} rotate={-2} delay={0.25} dragConstraints={dragConstraints}>
      <div className="tasks-header">
        <Icon icon={Task01Icon} size={16} />
        <p>Today&apos;s focus</p>
      </div>
      <ProgressRow title="Refine mobile menu" progress={78} />
      <ProgressRow title="Finish projects UI" progress={64} />
    </AnimatedCard>
  );
}

function IntegrationCard({ dragConstraints }: HeroDecorationsProps) {
  return (
    <AnimatedCard className="integrations-card" floatY={5} rotate={4} delay={0.3} dragConstraints={dragConstraints}>
      <p>Frontend Stack</p>
      <div className="integration-icons">
        <span className="integration-tile">
          <Icon icon={ReactIcon} size={25} />
        </span>
        <span className="integration-tile">
          <FlutterLogo />
        </span>
        <span className="integration-tile">
          <Icon icon={PythonIcon} size={25} />
        </span>
      </div>
    </AnimatedCard>
  );
}

export function HeroDecorations({ dragConstraints }: HeroDecorationsProps) {
  return (
    <>
      <StickyNoteCard dragConstraints={dragConstraints} />
      <ReminderCard dragConstraints={dragConstraints} />
      <TasksCard dragConstraints={dragConstraints} />
      <IntegrationCard dragConstraints={dragConstraints} />
    </>
  );
}
