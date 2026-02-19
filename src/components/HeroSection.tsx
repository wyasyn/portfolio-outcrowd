import { useRef } from 'react';
import { motion } from 'motion/react';
import { HeroContent } from './HeroContent';
import { HeroDecorations } from './HeroDecorations';
import { WorkspaceWindows } from './WorkspaceWindows';

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
      <HeroDecorations dragConstraints={sectionRef} />
      <HeroContent onExploreClick={onExploreClick} />
      <WorkspaceWindows />
    </motion.section>
  );
}
