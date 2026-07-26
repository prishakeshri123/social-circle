import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-600 text-text-inverse',
        secondary: 'border-transparent bg-surface text-text-primary',
        success: 'border-transparent bg-success-100 text-success-500',
        warning: 'border-transparent bg-warning-100 text-warning-500',
        error: 'border-transparent bg-error-100 text-error-500',
        outline: 'border-border-strong text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
