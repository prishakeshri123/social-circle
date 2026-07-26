import { en } from '@/shared/constants/locales/en';
import { CLUB_SORT_OPTIONS } from '@/shared/constants/app.constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { cn } from '@/shared/utils/cn';
import type { ClubFilters } from '@/types/club.types';

const SORT_LABELS: Record<(typeof CLUB_SORT_OPTIONS)[number], string> = {
  recommended: en.discovery.sortRecommended,
  newest: en.discovery.sortNewest,
  most_members: en.discovery.sortMostMembers,
};

const PRICE_OPTIONS: { value: ClubFilters['type'] | undefined; label: string }[] = [
  { value: undefined, label: en.discovery.priceAll },
  { value: 'free', label: en.discovery.priceFree },
  { value: 'paid', label: en.discovery.pricePaid },
];

interface FilterSortRowProps {
  type: ClubFilters['type'] | undefined;
  onTypeChange: (type: ClubFilters['type'] | undefined) => void;
  sort: (typeof CLUB_SORT_OPTIONS)[number];
  onSortChange: (sort: (typeof CLUB_SORT_OPTIONS)[number]) => void;
}

export function FilterSortRow({ type, onTypeChange, sort, onSortChange }: FilterSortRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        className="inline-flex rounded-full border border-border bg-surface p-1"
        role="group"
        aria-label={en.actions.filter}
      >
        {PRICE_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onTypeChange(option.value)}
            aria-pressed={type === option.value}
            className={cn(
              'rounded-full px-3.5 py-1 text-sm font-medium transition-colors duration-fast',
              type === option.value ? 'text-text-inverse' : 'text-text-secondary hover:bg-surface',
            )}
            style={type === option.value ? { background: 'var(--gradient-brand)' } : undefined}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Select
        value={sort}
        onValueChange={(v) => onSortChange(v as (typeof CLUB_SORT_OPTIONS)[number])}
      >
        <SelectTrigger
          className="w-44 border-border bg-surface"
          aria-label={en.discovery.sortLabel}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CLUB_SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
