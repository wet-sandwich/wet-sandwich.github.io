import { browser } from "$app/env";

// Move a localStorage value from an old key to a new one, once. Used when
// keys were namespaced per app (e.g. "currentTimer" → "timeit:currentTimer").
// Does nothing if the new key is already set or the old one is missing.
export function migrateStorageKey(oldKey: string, newKey: string): void {
  if (!browser) return;
  try {
    const old = localStorage.getItem(oldKey);
    if (old === null) return;
    if (localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, old);
    }
    localStorage.removeItem(oldKey);
  } catch (error) {
    console.error(`Failed to migrate storage key ${oldKey}:`, error);
  }
}
