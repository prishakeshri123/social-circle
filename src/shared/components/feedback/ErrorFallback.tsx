import { AlertTriangle } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { Button } from '@/shared/components/ui/Button';

interface ErrorFallbackProps {
  onRetry?: () => void;
}

export function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="size-10 text-error-500" aria-hidden="true" />
      <p className="text-sm text-text-secondary">{en.errors.serverError}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {en.actions.retry}
        </Button>
      )}
    </div>
  );
}
