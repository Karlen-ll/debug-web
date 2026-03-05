/** Console method names as constants for better minification */
export const LOG = 'log';
export const INFO = 'info';
export const DEBUG = 'debug';
export const WARN = 'warn';
export const ERROR = 'error';

/** Default level priority map for filtering console output */
export const DEFAULT_LVL_MAP = { [DEBUG]: 0, [LOG]: 1, [INFO]: 2, [WARN]: 3, [ERROR]: 4 };

/** Default aliases for shorthand console methods in proxy */
export const DEFAULT_ALIAS_MAP = {
  d: DEBUG,
  l: LOG,
  i: INFO,
  w: WARN,
  e: ERROR,
  update: 'set',
};
