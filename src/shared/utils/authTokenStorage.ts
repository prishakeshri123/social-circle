// Auth tokens default to sessionStorage, which is isolated per browser
// tab/window even within the same profile -- unlike localStorage, which is
// shared by every tab. That isolation is what lets two plain (non-Incognito)
// tabs stay logged in as two different accounts at once. Checking "Keep me
// signed in" mirrors the token into localStorage too, so it survives a
// reload/new tab/restart, matching what that label promises.
export function getStoredToken(key: string): string | null {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key);
}

export function setStoredToken(key: string, value: string, remember: boolean): void {
  sessionStorage.setItem(key, value);
  if (remember) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

export function clearStoredToken(key: string): void {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
}

export function isTokenRemembered(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
