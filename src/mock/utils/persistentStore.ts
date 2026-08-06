// Thin localStorage wrapper used by mock handlers to persist their
// in-memory "database" across reloads and browser tabs. This is a
// mock-only concern -- a real backend wouldn't need it -- so it stays
// under src/mock rather than src/shared.
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) -- the mock
    // simply falls back to per-tab-only behavior.
  }
}
