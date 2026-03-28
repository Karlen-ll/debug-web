export type DebugWebLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;

export type DebugWebData = Record<string, unknown>
export type DebugWebStyle = Partial<Record<DebugWebLogLevel, string | undefined>>
export type DebugWebOnLog = (level: DebugWebLogLevel, attrs: unknown[]) => void;

export interface DebugWebOptions {
  /** Unique application name
   * @desc Required to separate data of different applications in the same environment
   * @default 'debug' */
  app?: string | null;

  /** Allowed logging level
   * @desc Custom values will default to 'info' */
  level?: DebugWebLogLevel;

  /** Variable name in window (if null, do not create)
   * @default 'debug' */
  prop?: string | null;

  /** Important debugging data */
  data?: DebugWebData;

  /** Styles map for different logging levels */
  style?: DebugWebStyle;

  /** Callback function called on each log entry
   * @param level - Log level of the message
   * @param attrs - Array of logged arguments
   * @desc Useful for sending logs to external systems */
  onLog?: DebugWebOnLog;

  /** Use Storage for data storage instead of window property
   * @default false */
  storage?: boolean;

  /** Use localStorage instead of sessionStorage
   * @default false */
  local?: boolean;

  /** Use native console methods without styling
   * @default false */
  native?: boolean;
}

export type DebugWebAliasMap = Record<string, DebugWebLogLevel>
export type DebugWebTitleMap = Record<string, string>

export type CreateDebugOptions = DebugWebOptions & {
  /** Aliases map */
  alias?: DebugWebAliasMap

  /** Titles map for custom loggers */
  title?: DebugWebTitleMap
};

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
