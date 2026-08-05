import { getCategoryIconStyle } from '@/features/clubs/utils/getCategoryIconStyle';
import { cn } from '@/shared/utils/cn';

interface CategoryIconBadgeProps {
  category: string;
  className?: string;
}

export function CategoryIconBadge({ category, className }: CategoryIconBadgeProps) {
  const { icon: Icon, className: accentClassName } = getCategoryIconStyle(category);

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full text-white ring-4 ring-surface-raised',
        accentClassName,
        className,
      )}
    >
      <Icon className="size-1/2" aria-hidden="true" />
    </span>
  );
}
