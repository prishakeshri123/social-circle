import { useCallback, useState } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        window.sessionStorage.setItem(key, JSON.stringify(resolved));
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
}
