import { useMemo, useState } from 'react';
import { Input } from '@/shared/components/ui/Input';
import { en } from '@/shared/constants/locales/en';
import { CITIES } from '@/shared/constants/cities';
import { cn } from '@/shared/utils/cn';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!value) return [];
    const query = value.toLowerCase();
    return CITIES.filter((city) => city.toLowerCase().includes(query)).slice(0, 6);
  }, [value]);

  const showList = open && suggestions.length > 0;

  return (
    <div className="relative">
      <Input
        id="city"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={en.placeholders.city}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {showList && (
        <ul
          className="absolute z-raised mt-1 w-full overflow-hidden rounded-md border border-border bg-surface-raised shadow-card"
          role="listbox"
        >
          {suggestions.map((city) => (
            <li key={city}>
              <button
                type="button"
                role="option"
                aria-selected={value === city}
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm hover:bg-surface',
                  value === city && 'bg-surface',
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
