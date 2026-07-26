import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function EmptyState({ icon: Icon, title, ctaLabel, onCtaClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      {Icon && <Icon className="size-10 text-text-muted" aria-hidden="true" />}
      <p className="text-sm text-text-secondary">{title}</p>
      {ctaLabel && onCtaClick && (
        <Button variant="outline" size="sm" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
