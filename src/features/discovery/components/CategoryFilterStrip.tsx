import { LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '@/shared/constants/categories';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';
import { getIcon } from '@/shared/utils/iconRegistry';

interface CategoryFilterStripProps {
  selected: string | undefined;
  onSelect: (slug: string | undefined) => void;
}

const TILE_CLASSES =
  'group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-fast hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';

export function CategoryFilterStrip({ selected, onSelect }: CategoryFilterStripProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-primary">{en.discovery.browseByCategory}</h2>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        role="group"
        aria-label={en.discovery.filterByCategory}
      >
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          aria-pressed={!selected}
          className={cn(
            TILE_CLASSES,
            !selected
              ? 'border-primary-600 bg-primary-50'
              : 'border-border bg-surface hover:border-border-strong',
          )}
        >
          <LayoutGrid
            className={cn(
              'size-6',
              !selected ? 'text-primary-600' : 'text-text-secondary group-hover:text-primary-600',
            )}
          />
          <span
            className={cn(
              'text-sm font-medium',
              !selected ? 'text-primary-700' : 'text-text-primary',
            )}
          >
            {en.discovery.allCategories}
          </span>
        </button>

        {CATEGORIES.map((category) => {
          const Icon = getIcon(category.icon);
          const isSelected = selected === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onSelect(isSelected ? undefined : category.slug)}
              aria-pressed={isSelected}
              className={cn(
                TILE_CLASSES,
                isSelected
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-border bg-surface hover:border-border-strong',
              )}
            >
              <Icon
                className={cn(
                  'size-6',
                  isSelected
                    ? 'text-primary-600'
                    : 'text-text-secondary group-hover:text-primary-600',
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-primary-700' : 'text-text-primary',
                )}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
