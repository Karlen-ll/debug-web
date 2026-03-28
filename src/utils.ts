/** Checks if code is running on server-side (SSR) */
export const isSSR = (): boolean => typeof window === 'undefined';

/** Checks that the value is defined */
export const isDefined = <T>(value: T | undefined): value is T => typeof value !== 'undefined';

/** Checks that the value is a string */
export const isString = (value: unknown): value is string => typeof value === 'string';

/** Checks that the value is a function */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunc = (value: unknown): value is Function => typeof value === 'function';

/** Creates a key for safe access to custom properties of the `window` object */
export const getWindowKey = (name: string, raw?: boolean) => {
  return (raw ? name : Symbol.for(name)) as keyof Window;
};

/** Ensures value is always returned as an array */
export const getArray = <T = unknown>(value?: T[] | T | null): T[]  => Array.isArray(value) ? value : [value as T];

/** Determines console group method based on open state */
export const getGroupMethod = (value?: boolean) : 'group' | 'groupCollapsed' => `group${value ? '' : 'Collapsed'}`;

/** Safely executes localStorage operations with error handling */
const useStorage = <T>(callback: (storage?: Storage) => T | undefined, local?: boolean): T | undefined => {
  try {
    return !isSSR() ? callback(window[`${local ? 'local' : 'session'}Storage`]) : undefined;
  } catch {
    return;
  }
};

/**
 * Retrieves a stored value from Storage
 * @param key - Storage key
 * @param local - If true reads from localStorage, if false from sessionStorage
 */
export const getStoredValue = (key: string, local?: boolean): string | undefined | null => {
  return useStorage((storage) => {
    return storage?.getItem(key);
  }, local);
};

/**
 * Saves a value to Storage
 * @param key - Storage key
 * @param value - Value to store (if null or undefined, removes the key)
 * @param local - If true writes to localStorage, if false to sessionStorage
 */
export const setStoredValue = (key: string, value?: string | null, local?: boolean): boolean | undefined => {
  return useStorage((storage) => {
    if (value) {
      storage?.setItem(key, value);
    } else {
      storage?.removeItem(key);
    }

    return true;
  }, local);
};

/** Retrieves and parses a stored object from Storage
 * @param key - Storage key
 * @param local - If true reads from localStorage, if false from sessionStorage
 */
export const getStoredObject = (key: string, local?: boolean) => {
  const data = getStoredValue(key, local);

  if (!data) return;

  try {
    return JSON.parse(data);
  } catch {
    return;
  }
};

// ↓↓↓ For minification

type stringifyParams = Parameters<typeof JSON.stringify>

/** JSON.stringify with optional formatting */
export const stringify = (data: stringifyParams[0], space?: stringifyParams[2], replacer?: stringifyParams[1]) => {
  return JSON.stringify(data, replacer, space);
};

type definePropertyParams = Parameters<typeof Object.defineProperty>

/**  */
export const defineWindowProperty = (key: keyof Window | string, props: definePropertyParams[2]) => {
  return Object.defineProperty(window, key, { configurable: true, ...props });
};
