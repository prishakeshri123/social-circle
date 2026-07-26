import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: 'easeOut' } },
};

export const staggerChildren: Variants = {
  visible: { transition: { staggerChildren: 0.05 } },
};

/** Larger fade-up used for scroll-triggered marketing section reveals (see `Reveal`). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Stagger wrapper for groups of `Reveal`-style children animating into view together. */
export const staggerReveal: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
