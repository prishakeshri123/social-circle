import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { revealUp, staggerReveal } from '@/shared/utils/animations';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Fades + slides a section into view once it scrolls into the viewport. */
export function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={revealUp}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
}

/** Wraps a group of `RevealItem` children so they stagger into view together. */
export function RevealGroup({ children, className }: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerReveal}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode;
  className?: string;
}

export const RevealItem = forwardRef<HTMLDivElement, RevealItemProps>(function RevealItem(
  { children, className, ...rest },
  ref,
) {
  return (
    <motion.div ref={ref} className={className} variants={revealUp} {...rest}>
      {children}
    </motion.div>
  );
});
