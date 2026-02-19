import { motion } from 'motion/react';

export function BrandMark() {
  return (
    <motion.span className="brand-mark" aria-hidden="true">
      <span className="brand-dot brand-dot-accent" />
      <span className="brand-dot" />
      <span className="brand-dot" />
      <span className="brand-dot" />
    </motion.span>
  );
}
