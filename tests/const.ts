export const CONSOLE_METHODS = [
  'debug', 'log', 'info', 'warn', 'error', 'dir', 'dirxml', 'count', 'countReset', 'table',
  'group', 'groupCollapsed', 'groupEnd', 'time', 'timeLog', 'timeEnd', 'trace'
] as const;

export const DEFAULT_APP_NAME = '_debug_web' as const;
export const DEFAULT_PROP_NAME = 'info' as const;

export const TEST_APP_NAME = 'core' as const;
export const TEST_PROP_NAME = 'debug' as const;

export const TEST_MESSAGE = 'Text';

export const STYLES_STRING = 'color:#111';
export const STYLES_OBJECT = {
  info: STYLES_STRING,
  success: 'color:#13a10e',
  focus: 'color:#881798',
  alert: 'color:#ffa500',
  danger: 'color:red',
};

export const DATA_FRAGMENT_1 = { version: '1.0.0' } as const;
export const DATA_FRAGMENT_2 = { module: 'core' } as const;
export const COMPLETE_DATA = { ...DATA_FRAGMENT_1, ...DATA_FRAGMENT_2 };
