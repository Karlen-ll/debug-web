import { DebugWeb, createDebug, getLimitedArray, DebugWebOptions, DebugWebLogLevel, ConsoleMethod } from '../src'; // use from 'debug-web'

const HISTORY_SIZE = 10;
const isDev = process.env.NODE_ENV === 'development';

const getTime = () => new Date().toLocaleString();

/**
 * Examples of inheritance
 * @desc Saving history
 */
export class DebugWebWithHistory extends DebugWeb {
  declare protected _history: Record<string, Record<string, unknown>[]>;

  constructor(options?: DebugWebOptions) {
    super(options);
    this._history = {};
  }

  protected print(method: ConsoleMethod, attrs: unknown[], level?: DebugWebLogLevel, stylize?: boolean) {
    super.print(method, attrs, level, stylize);

    this._history.console = getLimitedArray(this._history.console, { time: getTime(), level, values: attrs }, HISTORY_SIZE);
  }

  protected fetch(method: string, url: string, status: string) {
    this._history.fetch = getLimitedArray(this._history.fetch, { time: getTime(), method, url, status }, HISTORY_SIZE);
  }

  get history() {
    return this._history;
  }

  clearHistory() {
    this._history = {};
  }
}

/**
 * Helper information for ease of use
 * @methods Styled methods: `info`, `mark`, `success`, `focus`, `alert`, `danger`
 * @desc `websocket` — logging for WebSocket
 */
export const debug = createDebug({
  level: isDev ? 'log' : 'error',
  style: { websocket: 'color: #155adc' },
  title: { websocket: 'WebSocket' },
}, DebugWebWithHistory);
