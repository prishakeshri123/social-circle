import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface NumberedStepperProps {
  steps: readonly string[];
  currentStep: number;
}

export function NumberedStepper({ steps, currentStep }: NumberedStepperProps) {
  const progressFraction = steps.length > 1 ? (currentStep - 1) / (steps.length - 1) : 0;

  return (
    <div className="relative" role="list" aria-label="Signup progress">
      <div
        className="absolute inset-x-3.5 top-3.5 h-0.5 -translate-y-1/2 rounded-full bg-border"
        aria-hidden="true"
      />
      <motion.div
        className="gradient-bg absolute left-3.5 top-3.5 h-0.5 -translate-y-1/2 rounded-full"
        initial={false}
        animate={{ width: `calc((100% - 1.75rem) * ${progressFraction})` }}
        transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div
              key={label}
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
              className="flex flex-col items-center gap-1.5"
              style={{ width: `${100 / steps.length}%` }}
            >
              <motion.span
                className={cn(
                  'relative flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  isCompleted || isActive
                    ? 'gradient-bg text-white'
                    : 'border border-border-strong bg-surface-raised text-text-muted',
                  isActive && 'neon-pulse',
                )}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isCompleted ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {stepNumber}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span
                className={cn(
                  'text-center text-[11px] font-medium leading-tight transition-colors duration-300',
                  isActive
                    ? 'text-primary-600'
                    : isCompleted
                      ? 'text-text-secondary'
                      : 'text-text-muted',
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
