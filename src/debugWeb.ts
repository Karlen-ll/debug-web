import { stylizeAttrs } from './stylize';
import {
  isSSR,
  isFunc,
  isDefined,
  getArray,
  getWindowKey,
  getGroupMethod,
  getStoredLvl,
  setStoredLvl,
} from '@/utils';
import { DEFAULT_LVL_MAP, DEBUG, LOG, INFO, WARN, ERROR, DEFAULT_STYLE } from '@/const';
import type { ConsoleMethod, DebugWebData, DebugWebLogLevel, DebugWebOptions, DebugWebStyle } from '@/types';

/** Class for centralized collection and output of debugging information */
export class DebugWeb {
  declare protected _lvl: DebugWebLogLevel;
  declare protected _app: string;
  declare protected _prop: string | null;
  declare protected _style: DebugWebStyle;
  declare protected _native: boolean;
  declare protected _local: boolean;

  /** Log levels mapping */
  declare protected _map: Partial<Record<DebugWebLogLevel, number>>;

  constructor(options?: DebugWebOptions) {
    this.init(options);
    this.attach();
  }

  /** Create window property for data access */
  attach() {
    if (!this._prop || isSSR()) return;

    Object.defineProperty(window, this._prop, { get: () => this.get(true), configurable: true });
  }

  /** Output message to Web console */
  log(...attrs: unknown[]) {
    this.call(LOG, attrs, LOG, true);
  }

  /** Output informational message */
  info(...attrs: unknown[]) {
    this.call(INFO, attrs, INFO, true);
  }

  /** Output warning message */
  warn(...attrs: unknown[]) {
    this.call(WARN, attrs, WARN);
  }

  /** Output error message */
  error(...attrs: unknown[]) {
    this.call(ERROR, attrs, ERROR);
  }

  /** Output debug message with low priority */
  debug(message?: unknown, ...attrs: unknown[]) {
    this.call(DEBUG, [message, ...attrs], DEBUG);
  }

  /** Open a group */
  group(open?: boolean, level: DebugWebLogLevel = LOG, ...attrs: unknown[]) {
    this.call(getGroupMethod(open), attrs, level, true);
  }

  /** Close the group */
  groupEnd(level: DebugWebLogLevel = LOG) {
    this.call('groupEnd', [], level);
  }

  /** Output an object */
  dir(value: unknown, options?: unknown) {
    this.call('dir', [value, options], LOG);
  }

  /** Output XML/HTML tree of elements */
  dirxml(...attrs: unknown[]) {
    this.call('dirxml', attrs, LOG);
  }

  /** Log number of times called with given label */
  count(label?: string) {
    this.call('count', label, LOG);
  }

  /** Reset counter for the given label */
  countReset(label?: string) {
    this.call('countReset', label, LOG);
  }

  /** Output stack trace */
  trace(...attrs: unknown[]) {
    this.call('trace', attrs);
  }

  /** Output a table */
  table(data: unknown, properties?: string[]) {
    this.call('table', [data, properties]);
  }

  /** Start timer for execution time measurement */
  time(label?: string) {
    this.call('time', label);
  }

  /** Output current timer value */
  timeLog(label?: string, ...attrs: unknown[]) {
    this.call('timeLog', [label, ...attrs]);
  }

  /** Finish execution time measurement */
  timeEnd(label?: string) {
    this.call('timeEnd', label);
  }

  /** Update debugging data */
  set(data: DebugWebData) {
    if (isSSR()) return;

    const storageName = getWindowKey(this._app);
    const value = Object.assign(window[storageName] || {}, data);

    Object.keys(value).forEach(key => {
      if (value[key] === undefined) {
        delete value[key];
      }
    });

    Object.defineProperty(window, storageName, { value, writable: true, enumerable: false, configurable: true });
  }

  /** Persist log level */
  set level(level: DebugWebLogLevel) {
    this._lvl = level;
  }

  /** Get current log level as string */
  get level() {
    return this._lvl;
  }

  /** Get styles map by logging level */
  get style(): DebugWebStyle {
    return this._style;
  }

  /** Update styles map by logging level or entirely */
  set style(style: DebugWebStyle) {
    Object.assign(this._style, style);
  }

  /** Get all collected debugging data */
  get(api?: boolean) {
    if (isSSR()) return;

    const data = { ...window[getWindowKey(this._app)] } as DebugWebData;

    if (api) {
      data.setLevel = this.setLvl.bind(this);
    }

    return data;
  }

  /** Display a formatted dump of debugging data by selected keys
   * @param keys - Array of property names to include in the dump
   * @param options - Configuration options for the dump display
   * @param options.level - Logging level for the dump (default: 'info')
   * @param options.title - Custom title or function that returns title based on data
   * @param options.open - If true opens group expanded, if false collapsed (default: false)
   * @desc Groups related debug data into a collapsible console section with table view
   */
  dump(keys: string[], options?: {
    level?: DebugWebLogLevel;
    title?: string | ((data: DebugWebData) => string);
    open?: boolean
  }) {
    const data = this.get();

    if (!data || !keys.length) return;
    const isSimple = !options?.title;

    this.call(
      getGroupMethod(options?.open),
      [isSimple ? data[keys[0]] || keys[0] : isFunc(options.title) ? options.title(data) : options.title],
      options?.level,
      true,
      true
    );

    this.call(
      'table',
      [keys.reduce<DebugWebData>((acc, key, index) => {
        if (!(isSimple && index === 0) && isDefined(data[key])) {
          acc[key] = data[key];
        }

        return acc;
      }, {})],
      options?.level,
      false,
      true
    );

    this.call('groupEnd', [], options?.level, false, true);
  }

  /** Core method for logging with level filtering and formatting
   * @param method - Console method to use (log, info, warn, etc.)
   * @param attrs - Single value or array of values to log
   * @param level - Logging level for filtering (default: based on method)
   * @param stylize - Apply CSS styling to the output (default: false)
   * @param force - Bypass level filtering and always output (default: false)
   * @returns void, exits early if level is below current threshold (unless forced)
   */
  call(method: ConsoleMethod, attrs: unknown | unknown[], level?: DebugWebLogLevel, stylize = false, force = false) {
    // Default value, all unspecified values will have priority — INFO
    const info = this._map[INFO]!;

    if (!force && this.getLvl(level, info) < this.getLvl(this._lvl, info)) {
      return;
    }

    this.print(method, getArray(attrs), level, stylize ? !this._native : false);
  }

  /** Configure instance */
  protected init(options?: DebugWebOptions) {
    this._app = options?.app || '_debug_web';
    this._prop = isDefined(options?.prop) ? options.prop : INFO;
    this._map = DEFAULT_LVL_MAP;
    this._lvl = getStoredLvl(this._app, this._local) || options?.level || LOG;
    this._native = options?.native || false;
    this._local = options?.local || false;
    this._style = { ...DEFAULT_STYLE, ...options?.style };

    if (options?.data) {
      this.set(options.data);
    }
  }

  /** Get logging level priority number */
  protected getLvl(level?: DebugWebLogLevel, defaultValue = -1): number {
    const lvl = level ? this._map[level] : undefined;

    return isDefined(lvl) ? lvl : defaultValue;
  }

  /** Set log level and persist to storage for browser debugging
   * @param level - Target log level or true to reset to default ('log')
   */
  protected setLvl(level: DebugWebLogLevel | true = true) {
    this._lvl = level === true ? LOG : level;
    setStoredLvl(this._app, this._lvl, this._local);
  }

  /** Format and output data using specified console method and level styling */
  protected print(method: ConsoleMethod, attrs: unknown[], level: DebugWebLogLevel = INFO, stylize?: boolean) {
    const args = stylize ? stylizeAttrs(attrs, this._style[level]) : attrs;

    console[method](...args as never[]);
  }
}
