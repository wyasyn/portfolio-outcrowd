import { lazy, Suspense, useRef } from 'react';
import { motion } from 'motion/react';
import { HeroContent } from './HeroContent';

const HeroDecorations = lazy(async () => {
  const module = await import('./HeroDecorations');
  return { default: module.HeroDecorations };
});

const WorkspaceWindows = lazy(async () => {
  const module = await import('./WorkspaceWindows');
  return { default: module.WorkspaceWindows };
});

type HeroSectionProps = {
  onExploreClick?: () => void;
};

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <motion.section
      ref={sectionRef}
      className="hero-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
    >
      <Suspense fallback={null}>
        <HeroDecorations dragConstraints={sectionRef} />
      </Suspense>
      <HeroContent onExploreClick={onExploreClick} />
      <Suspense fallback={<div className="workspace-layer" aria-hidden="true" />}>
        <WorkspaceWindows />
      </Suspense>
    </motion.section>
  );
}
