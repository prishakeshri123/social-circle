import { Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">{en.search.recentSearchesTitle}</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {en.search.clearRecent}
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {searches.map((query) => (
          <li key={query}>
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-sm text-text-secondary hover:bg-surface"
            >
              <Search className="size-3.5" aria-hidden="true" />
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
