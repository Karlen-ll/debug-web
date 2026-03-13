export type DebugWebLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;

export type DebugWebData = Record<string, unknown>
export type DebugWebStyle = Partial<Record<DebugWebLogLevel, string | undefined>>

export interface DebugWebOptions {
  /** Unique application name
   * @desc Required to separate data of different applications in the same environment */
  app?: string | null;

  /** Allowed logging level
   * @desc Custom values will default to 'info' */
  level?: DebugWebLogLevel;

  /** Variable name in window (if null, do not create)
   * @default 'info' */
  prop?: string | null;

  /** Important debugging data */
  data?: DebugWebData;

  /** Styles map for different logging levels */
  style?: DebugWebStyle;

  /** Use localStorage instead of sessionStorage
   * @default false */
  local?: boolean;

  /** Use native console methods without styling
   * @default false */
  native?: boolean;
}

export type DebugWebAliasMap = Record<string, DebugWebLogLevel>
export type CreateDebugOptions = DebugWebOptions & { aliases?: DebugWebAliasMap };
export type CustomLogLevels = Record<string, (...attrs: unknown[]) => void>;

export type ConsoleMethod =
  'debug'
  | 'log'
  | 'info'
  | 'warn'
  | 'error'
  | 'dir'
  | 'dirxml'
  | 'count'
  | 'countReset'
  | 'table'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'time'
  | 'timeLog'
  | 'timeEnd'
  | 'trace';
