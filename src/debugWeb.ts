import {
  isSSR,
  isFunc,
  isDefined,
  getArray,
  stringify,
  getWindowKey,
  getGroupMethod,
  getStoredValue,
  setStoredValue,
  getStoredObject,
  defineWindowProperty,
} from '@/utils';
import { stylizeAttrs } from './stylize';
import { DEFAULT_LVL_MAP, DEBUG, LOG, INFO, WARN, ERROR, TABLE, DEFAULT_STYLE } from '@/const';
import type {
  ConsoleMethod, DebugWebData, DebugWebStyle, DebugWebOptions, DebugWebLogLevel, DebugWebOnLog,
  DebugWebFunctionMap
} from '@/types';

/** Class for centralized collection and output of debugging information */
export class DebugWeb {
  /** App identifier */
  declare protected _id: string;

  /** Level
   * @desc Current log level */
  declare protected _lvl: DebugWebLogLevel;

  /** Prop
   * @desc Window property name */
  declare protected _prp: string | null;

  /** Style
   * @desc CSS styles by level */
  declare protected _stl: DebugWebStyle;

  /** Native
   * @desc Use native console */
  declare protected _ntv?: boolean;

  /** Use localStorage (vs session) */
  declare protected _ls?: boolean;

  /** Log callback */
  declare protected _on?: DebugWebOnLog;

  /** Log levels mapping */
  declare protected _map: Partial<Record<DebugWebLogLevel, number>>;

  /** Functions
   * @desc Map of functions available in the console */
  declare protected _fns: DebugWebFunctionMap;

  /** Window instance key */
  declare protected __w: keyof Window;

  /** Storage key for level
   * @desc Uses the _id key for data */
  declare protected __s: string;

  constructor(options?: DebugWebOptions) {
    this.init(options);
    this.attach();
  }

  // Alias for code minification
  protected _ = this.call;

  /** Create window property for data access */
  attach() {
    if (!this._prp || isSSR()) return;

    defineWindowProperty(this._prp, {
      get: () => ({
        ...this.get(),
        ...(Object.entries(this._fns).reduce((acc, [name, fn]) => {
          acc[name] = fn.bind(this);
          return acc;
        }, {} as DebugWebFunctionMap))
      })
    });
  }

  /** Output message to Web console */
  log(...attrs: unknown[]) {
    this._(LOG, attrs, LOG, true);
  }

  /** Output informational message */
  info(...attrs: unknown[]) {
    this._(INFO, attrs, INFO, true);
  }

  /** Output warning message (not stylized) */
  warn(...attrs: unknown[]) {
    this._(WARN, attrs, WARN);
  }

  /** Output error message (not stylized) */
  error(...attrs: unknown[]) {
    this._(ERROR, attrs, ERROR);
  }

  /** Output debug message with low priority */
  debug(message?: unknown, ...attrs: unknown[]) {
    this._(DEBUG, [message, ...attrs], DEBUG, true);
  }

  /** Open a group */
  group(open?: boolean, level: DebugWebLogLevel = LOG, ...attrs: unknown[]) {
    this._(getGroupMethod(open), attrs, level, true);
  }

  /** Close the group */
  groupEnd(level: DebugWebLogLevel = LOG) {
    this._('groupEnd', [], level);
  }

  /** Output an object */
  dir(value: unknown, options?: unknown) {
    this._('dir', [value, options], LOG);
  }

  /** Output XML/HTML tree of elements */
  dirxml(...attrs: unknown[]) {
    this._('dirxml', attrs, LOG);
  }

  /** Log number of times called with given label */
  count(label?: string) {
    this._('count', label, LOG);
  }

  /** Reset counter for the given label */
  countReset(label?: string) {
    this._('countReset', label, LOG);
  }

  /** Output stack trace */
  trace(...attrs: unknown[]) {
    this._('trace', attrs);
  }

  /** Output a table */
  table(data: unknown, properties?: string[]) {
    this._(TABLE, [data, properties]);
  }

  /** Start timer for execution time measurement */
  time(label?: string) {
    this._('time', label);
  }

  /** Output current timer value */
  timeLog(label?: string, ...attrs: unknown[]) {
    this._('timeLog', [label, ...attrs]);
  }

  /** Finish execution time measurement */
  timeEnd(label?: string) {
    this._('timeEnd', label);
  }

  /** Update debugging data */
  set(data?: DebugWebData, storage?: boolean) {
    if (!data || isSSR()) return;

    const value: DebugWebData = Object.assign((storage ? getStoredObject(this._id) : window[this.__w]) || {}, data);

    for (const key in value) {
      if (value[key] === undefined) {
        delete value[key];
      }
    }

    if (storage) {
      setStoredValue(this._id, stringify(value));
    } else {
      defineWindowProperty(this.__w, { value, writable: true });
    }
  }

  /** Get all collected debugging data */
  get(storage?: boolean) {
    if (isSSR()) return;

    return (storage ? getStoredObject(this._id) : window[this.__w]) as DebugWebData | undefined;
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
    return this._stl;
  }

  /** Update styles map by logging level or entirely */
  set style(style: DebugWebStyle) {
    Object.assign(this._stl, style);
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

    this.print(method, getArray(attrs), level, stylize ? !this._ntv : false);
  }

  /** Display a formatted dump of debugging data by selected keys
   * @param keys - Array of property names to include in the dump
   * @param options - Configuration options for the dump display
   * @param options.level - Logging level for the dump (default: 'info')
   * @param options.title - Custom title or function that returns title based on data
   * @param options.open - If true opens group expanded, if false collapsed (default: false)
   * @param options.hint - Supporting information
   * @desc Groups related debug data into a collapsible console section with table view
   */
  dump(keys: string[], options?: {
    level?: DebugWebLogLevel;
    title?: string | ((data: DebugWebData) => string);
    hint?: string
    open?: boolean
  }) {
    const data = this.get();
    const level = options ? options.level : undefined;

    if (!data || !keys.length) return;
    const isSimple = !(options && options.title);

    this._(
      getGroupMethod(options && options.open),
      [isSimple ? data[keys[0]] || keys[0] : isFunc(options.title) ? options.title(data) : options.title],
      level,
      true,
      true
    );

    if (options && options.hint) {
      this._(LOG, options.hint, options.level, false, true);
    }

    this._(
      TABLE,
      [keys.reduce<DebugWebData>((acc, key, index) => {
        if (!(isSimple && index === 0) && isDefined(data[key])) {
          acc[key] = data[key];
        }

        return acc;
      }, {})],
      level,
      false,
      true
    );

    this._('groupEnd', [], level, false, true);
  }

  /** Configure instance */
  protected init(options?: DebugWebOptions) {
    this._id = options && options.app || DEBUG;
    this._prp = options && isDefined(options.prop) ? options.prop : DEBUG;
    this._map = { ...DEFAULT_LVL_MAP };

    this.__w = getWindowKey(this._id);
    this.__s = this._id + ':level';

    if (options) {
      this._ls = options.local;
      this._ntv = options.native;
      this._on = options.onLog;
      this.set(options.data);
    }

    this._lvl = getStoredValue(this.__s, this._ls) || options && options.level || LOG;
    this._stl = { ...DEFAULT_STYLE, ...(options ? options.style : undefined) };
    this._fns = { setLevel: this.setLvl };
  }

  /** Get logging level priority number */
  protected getLvl(level?: DebugWebLogLevel, defaultValue = -1): number {
    const lvl = level ? this._map[level] : undefined;

    return isDefined(lvl) ? lvl : defaultValue;
  }

  /** Set log level and persist to storage for browser debugging
   * @param level - Target log level or true to reset to default ('log') */
  protected setLvl(level: DebugWebLogLevel | true = true) {
    this._lvl = level === true ? LOG : level;
    setStoredValue(this.__s, this._lvl, this._ls);
  }

  /** Format and output data using specified console method and level styling */
  protected print(method: ConsoleMethod, attrs: unknown[], level: DebugWebLogLevel = INFO, stylize?: boolean) {
    const args = stylize ? stylizeAttrs(attrs, this._stl[level]) : attrs;

    console[method](...args as never[]);
    if (this._on) this._on(level, attrs);
  }
}
