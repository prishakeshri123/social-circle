import { CATEGORIES } from '@/shared/constants/categories';
import { cn } from '@/shared/utils/cn';
import { getIcon } from '@/shared/utils/iconRegistry';

interface InterestChipsProps {
  selected: string[];
  onToggle: (slug: string) => void;
}

export function InterestChips({ selected, onToggle }: InterestChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" role="group">
      {CATEGORIES.map((category) => {
        const Icon = getIcon(category.icon);
        const isSelected = selected.includes(category.slug);

        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onToggle(category.slug)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              isSelected
                ? 'scale-105 border-primary-600 bg-primary-600 text-text-inverse'
                : 'border-border-strong bg-background text-text-secondary hover:bg-surface',
            )}
          >
            <Icon className="size-3.5" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
