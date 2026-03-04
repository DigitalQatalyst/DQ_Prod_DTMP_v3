/**
 * Shared localStorage utilities for marketplace requestState modules.
 *
 * Eliminates the duplicated isBrowser / parseJson / readXxx / writeXxx
 * boilerplate that would otherwise appear verbatim in every requestState file.
 *
 * Usage:
 *   const store = makeLocalStorageStore<MyRequest>("dtmp.myMarketplace.requests", 300);
 *   const all   = store.read();
 *   store.write([newItem, ...all]);
 */

const isBrowser = typeof window !== "undefined";

export const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const readLocalStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  return parseJson<T>(window.localStorage.getItem(key), fallback);
};

export const writeLocalStorage = <T>(key: string, value: T, limit: number): void => {
  if (!isBrowser) return;
  const data = Array.isArray(value) ? (value as unknown[]).slice(0, limit) : value;
  window.localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Returns a typed { read, write } pair backed by a single localStorage key.
 * `limit` caps the number of items persisted on every write (oldest dropped).
 */
export const makeLocalStorageStore = <T>(
  key: string,
  limit: number
): { read: () => T[]; write: (items: T[]) => void } => ({
  read: (): T[] => readLocalStorage<T[]>(key, []),
  write: (items: T[]): void => writeLocalStorage(key, items, limit),
});
