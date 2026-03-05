/** Checks if code is running on server-side (SSR) */
export const isSSR = (): boolean => typeof window === 'undefined';

/** Checks that the value is a string */
export const isString = (value: unknown): value is string => typeof value === 'string';

/** Checks that the value is a function */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunc = (value: unknown): value is Function => typeof value === 'function';

/** Generates a localStorage key */
export const getStorageKey = (app: string) => `${app}:level`;

/** Creates a key for safe access to custom properties of the `window` object */
export const getWindowKey = (name: string, raw?: boolean) => {
  return (raw ? name : Symbol.for(name)) as keyof Window;
};

/** Ensures value is always returned as an array */
export const getArray = <T = unknown>(value?: T[] | T | null): T[]  => Array.isArray(value) ? value : [value as T];

/** Determines console group method based on open state */
export const getGroupMethod = (value = false) : 'group' | 'groupCollapsed' => `group${value ? '' : 'Collapsed'}`;

/** Safely executes localStorage operations with error handling */
const safeLocalStorage = <T>(callback: (storage?: Storage) => T | undefined, local?: boolean): T | undefined => {
  try {
    return !isSSR() ? callback(window[`${local ? 'local' : 'session'}Storage`]) : undefined;
  } catch {
    return;
  }
};

/** Safely reads and parses the logging level from localStorage
 * @param app - Application identifier used as key prefix
 * @param local - If true reads from localStorage, if false from sessionStorage
 * @returns Stored level value or undefined if not found/error
 */
export const getStoredLvl = (app: string, local?: boolean): string | undefined | null => {
  return safeLocalStorage((storage) => {
    return storage?.getItem(getStorageKey(app));
  }, local);
};

/** Safely writes logging level to localStorage
 * @param app - Application identifier used as key prefix
 * @param level - Level to store (if null/undefined, removes the key)
 * @param local - If true writes to localStorage, if false to sessionStorage
 * @returns True if operation succeeded, undefined if failed
 */
export const setStoredLvl = (app: string, level?: string | null, local?: boolean): boolean | undefined => {
  return safeLocalStorage((storage) => {
    if (level) {
      storage?.setItem(getStorageKey(app), level);
    } else {
      storage?.removeItem(getStorageKey(app));
    }

    return true;
  }, local);
};
