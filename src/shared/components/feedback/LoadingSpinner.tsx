import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)} role="status">
      <Loader2 className="animate-spin text-primary-600" size={size} aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
