import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/shared/utils/cn';

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-surface', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary-600 transition-transform duration-normal"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
