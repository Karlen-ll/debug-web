import { getWindowKey } from '@/utils';

export const CONSOLE_METHODS = [
  'debug', 'log', 'info', 'warn', 'error', 'dir', 'dirxml', 'count', 'countReset', 'table',
  'group', 'groupCollapsed', 'groupEnd', 'time', 'timeLog', 'timeEnd', 'trace'
] as const;

export const DEFAULT_APP_NAME = getWindowKey('_debug_web');
export const DEFAULT_PROP_NAME = 'debug' as const;

export const TEST_RAW_APP_NAME = 'core' as const;
export const TEST_APP_NAME = getWindowKey(TEST_RAW_APP_NAME);
export const TEST_PROP_NAME = '_debug' as const;

export const TEST_MESSAGE = 'Text';
export const TEST_STR_STYLE = 'color:red';
export const TEST_STYLES = { custom: TEST_STR_STYLE };

export const DATA_FRAGMENT_1 = { version: '1.0' } as const;
export const DATA_FRAGMENT_2 = { module: 'test' } as const;
export const COMPLETE_DATA = { ...DATA_FRAGMENT_1, ...DATA_FRAGMENT_2 };
