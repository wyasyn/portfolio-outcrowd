import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';

type HeroContentProps = {
  onExploreClick?: () => void;
};

function IconCluster() {
  return (
    <motion.div
      className="icon-cluster"
      aria-hidden
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.44, delay: 0.18, ease: 'easeOut' },
        scale: { type: 'spring', stiffness: 220, damping: 20, delay: 0.18 },
        y: { type: 'spring', stiffness: 220, damping: 20, delay: 0.18 },
      }}
    >
      <span className="cluster-dot cluster-dot-accent" />
      <span className="cluster-dot" />
      <span className="cluster-dot" />
      <span className="cluster-dot" />
    </motion.div>
  );
}

export function HeroContent({ onExploreClick }: HeroContentProps) {
  return (
    <motion.div
      className="hero-content"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.18,
          },
        },
      }}
    >
      <IconCluster />
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 14 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        Design, build, ship
        <span>build bold web experiences</span>
      </motion.h1>
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        Frontend developer in Kampala. Fast. Clean. Accessible.
      </motion.p>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button className="hero-cta" onClick={onExploreClick}>
          Explore work
          <Icon icon={ArrowRight01Icon} size={16} />
        </Button>
      </motion.div>
    </motion.div>
  );
}
