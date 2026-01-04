export const isDefined = <T>(value: T | undefined): value is T => typeof value !== 'undefined';

export const isString = (value: unknown): value is string => typeof value === 'string';

export const getWindowKey = (name: string, useSymbol = false) => {
  return (useSymbol ? Symbol.for(name) : name) as keyof Window;
};

