/** Checks that the value is defined */
export const isDefined = <T>(value: T | undefined): value is T => typeof value !== 'undefined';

/** Checks that the value is a string */
export const isString = (value: unknown): value is string => typeof value === 'string';

/** Creates a key for safe access to custom properties of the `window` object */
export const getWindowKey = (name: string, useSymbol = false) => {
  return (useSymbol ? Symbol.for(name) : name) as keyof Window;
};
