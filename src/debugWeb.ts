import { stylizeAttrs, defaultStyle } from './stylize';
import { getWindowKey, isDefined, isString } from '@/utils';

type ConsoleMethod = 'debug' | 'log' | 'info' | 'warn' | 'error' | 'group' | 'groupCollapsed';

export type DebugWebLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;

export type DebugWebData = Record<string, unknown>
export type DebugWebStyle = Partial<Record<DebugWebLogLevel, string | null>>

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
}

const LEVEL_INFO = 2;
const LEVEL_ERROR = 4;
const DEFAULT_VALUE = { app: '__web_debug__', prop: 'info' };

/**
 * Class for centralized collection and output of debugging information
 * @singleton
 */
export class DebugWeb {
  protected static _level: number = 0;
  protected static _app = DEFAULT_VALUE.app;
  protected static _prop: string | null = DEFAULT_VALUE.prop;
  protected static _style: DebugWebStyle = defaultStyle;
  protected static _levelMap: Partial<Record<DebugWebLogLevel, number>> = {
    'debug': 0,
    'log': 1,
    'info': 2,
    'warn': 3,
    'error': 4
  };

  protected constructor() {
    // Protected constructor for Singleton
  }

  /**
   * Creates a Debug instance
   * @desc Called once at the application entry point
   * @example WebDebug.init({ level: 'error' })
   */
  static init(options?: DebugWebOptions) {
    if (options) {
      if (options.app?.trim()) {
        DebugWeb._app = options.app;
      }

      if (isDefined(options.level)) {
        DebugWeb._level = DebugWeb.getLevel(options.level);
      }

      if (isDefined(options.prop)) {
        DebugWeb._prop = options.prop;
      }

      if (options.style) {
        DebugWeb.setStyle(options.style);
      }

      if (options.data) {
        DebugWeb.set(options.data);
      }
    }

    DebugWeb.attach();
  }

  /** Create window.info property for data access */
  static attach() {
    if (!DebugWeb._prop || !isDefined(window)) {
      return;
    }

    Object.defineProperty(window, DebugWeb._prop, { get: () => DebugWeb.get(), configurable: true });
  }

  /** Output message to Web console
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/log_static console.log} */
  static log(...attrs: unknown[]) {
    if (!DebugWeb.can()) return;
    DebugWeb.print('log', 'log', attrs);
  }

  /** Output informational message
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/info_static console.info} */
  static info(...attrs: unknown[]) {
    if (!DebugWeb.can('info')) return;
    DebugWeb.print('info', 'info', attrs);
  }

  /** Output success message
   * @desc Uses the `console.info` */
  static success(...attrs: unknown[]) {
    if (!DebugWeb.can('success')) return;
    DebugWeb.print('info', 'success', attrs);
  }

  /** Output warning message
   * @desc Method is not styled
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/warn_static console.warn} */
  static warn(...attrs: unknown[]) {
    if (!DebugWeb.can('warn')) return;
    console.warn(...attrs);
  }

  /** Output error message
   * @desc Method is not styled
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/error_static console.error} */
  static error(error: Error | string, ...attrs: unknown[]) {
    if (!DebugWeb.can('error')) return;

    if (error instanceof Error) {
      if (DebugWeb._level < LEVEL_ERROR && error.stack) {
        console.error(error.message, error.stack, ...attrs);
      } else {
        console.error(error.message, ...attrs);
      }
    } else {
      console.error(error, ...attrs);
    }
  }

  /** Output debug message with low priority
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/debug_static console.debug} */
  static debug(message?: unknown, ...attrs: unknown[]) {
    if (!DebugWeb.can('debug')) return;
    console.debug(message, ...attrs);
  }

  /** Open a group (level: log)
   * @desc level — only for styling, does not affect logging
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/group_static console.group} */
  static group(collapsed?: boolean, level: DebugWebLogLevel = 'log', ...attrs: unknown[]) {
    if (!DebugWeb.can()) return;
    DebugWeb.print(collapsed ? 'groupCollapsed' : 'group', level, attrs);
  }

  /** Close the group (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/groupEnd_static console.groupEnd} */
  static groupEnd() {
    if (!DebugWeb.can()) return;
    console.groupEnd();
  }

  /** Output an object (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/dir_static console.dir} */
  static dir(value: unknown, options?: Parameters<typeof console.dir>[1]) {
    if (!DebugWeb.can()) return;
    console.dir(value, options);
  }

  /** Output XML/HTML tree of elements (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/dirxml_static console.dirxml} */
  static dirxml(...attrs: unknown[]) {
    if (!DebugWeb.can()) return;
    console.dirxml(...attrs);
  }

  /** Log number of times called with given label (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/count_static console.count} */
  static count(label?: string) {
    if (!DebugWeb.can()) return;
    console.count(label);
  }

  /** Reset counter for the given label (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/countReset_static console.countReset} */
  static countReset(label?: string) {
    if (!DebugWeb.can()) return;
    console.countReset(label);
  }

  /** Output a table (level: info)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/table_static console.table} */
  static table(data: unknown, properties?: Parameters<typeof console.table>[1]) {
    if (!DebugWeb.can('info')) return;
    console.table(data, properties);
  }

  /** Start timer for execution time measurement (level: info)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/time_static console.time} */
  static time(label?: string) {
    if (!DebugWeb.can('info')) return;
    console.time(label);
  }

  /** Output current timer value (level: info)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/timeLog_static console.timeLog} */
  static timeLog(label?: string, ...attrs: unknown[]) {
    if (!DebugWeb.can('info')) return;
    console.timeLog(label, ...attrs);
  }

  /** Finish execution time measurement (level: info)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/timeEnd_static console.timeEnd} */
  static timeEnd(label?: string) {
    if (!DebugWeb.can('info')) return;
    console.timeEnd(label);
  }

  /** Output stack trace (level: log)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/console/trace_static console.trace} */
  static trace(message?: unknown, ...attrs: unknown[]) {
    if (!DebugWeb.can()) return;
    console.trace(message, ...attrs);
  }

  /**
   * Update debugging data
   * @desc Data is stored in the window object
   * @example WebDebug.add({ mode })
   */
  static set(data: DebugWebData) {
    if (!isDefined(window)) {
      return;
    }

    const storageName = getWindowKey(DebugWeb._app, true);

    Object.defineProperty(window, storageName, {
      value: Object.assign(window[storageName] || {}, data),
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  /** Get all collected debugging data */
  static get() {
    return isDefined(window) ? window[getWindowKey(DebugWeb._app, true)] : undefined;
  }

  /**
   * Update styles map by logging level or entirely
   * @example WebDebug.setStyle('info', 'color: #155adc')
   * @example WebDebug.setStyle({ info: 'color: #155adc', warn: 'color: #ffa500' })
   */
  static setStyle(levelOrMap: DebugWebLogLevel | DebugWebStyle, style?: string | null) {
    if (isString(levelOrMap)) {
      DebugWeb._style[levelOrMap] = style;
    } else {
      Object.assign(DebugWeb._style, levelOrMap);
    }
  }

  /** Get styles map by logging level */
  static getStyle(): DebugWebStyle {
    return DebugWeb._style;
  }

  /** Clear all debugging data and remove global references */
  static reset() {
    if (isDefined(window)) {
      delete window[getWindowKey(DebugWeb._app, true)];
      delete window[getWindowKey(DebugWeb._prop!)]; // Can be null, but it's okay
    }

    DebugWeb._level = 0;
    DebugWeb._app = DEFAULT_VALUE.app;
    DebugWeb._prop = DEFAULT_VALUE.prop;
  }

  /** Check if logging level is enabled */
  protected static can(level: DebugWebLogLevel = 'log'): boolean {
    return DebugWeb.getLevel(level) >= DebugWeb._level;
  }

  /** Get logging level priority number */
  protected static getLevel(level: DebugWebLogLevel): number {
    return DebugWeb._levelMap[level] ?? LEVEL_INFO;
  }

  /** Format and output data using specified console method and level styling */
  protected static print(method: ConsoleMethod, level: DebugWebLogLevel, attrs: unknown[]) {
    console[method](...stylizeAttrs(attrs, DebugWeb._style[level]));
  }
}
