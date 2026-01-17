export const DEFAULT_APP_NAME = '__debug_web__' as const;
export const DEFAULT_PROP_NAME = 'info' as const;

export const TEST_APP_NAME = 'core' as const;
export const TEST_PROP_NAME = 'debug' as const;

export const TEST_MESSAGE = 'Text';

export const STYLES_STRING = 'color:red';
export const STYLES_OBJECT = { info: 'color:#111', success: 'color:#13a10e', warn: 'color:#ffa500', error: 'color:red' };

export const DATA_FRAGMENT_1 = { version: '1.0.0' } as const;
export const DATA_FRAGMENT_2 = { module: 'core' } as const;
export const COMPLETE_DATA = { ...DATA_FRAGMENT_1, ...DATA_FRAGMENT_2 };
