import { DebugWeb } from '@/debugWeb';
import { getWindowKey, isSSR } from '@/utils';
import { defaultStyle } from '@/stylize';
import { DEFAULT_APP_NAME, DEFAULT_PROP_NAME } from './const';
import type { DebugWebOptions } from '@/types';

export class TestDebugWeb extends DebugWeb {
  constructor(options?: DebugWebOptions) {
    super(options);
  }

  reset(options?: DebugWebOptions) {
    if (!isSSR()) {
      delete window[getWindowKey(this._app)];

      if (this._prop) {
        delete window[getWindowKey(this._prop, true)];
      }
    }

    this._app = options?.app ?? DEFAULT_APP_NAME;
    this._lvl = this.getLvl(options?.level ?? 'log');
    this._prop = typeof options?.prop !== 'undefined' ? options.prop : DEFAULT_PROP_NAME;
    this._native = options?.native ?? false;
    this._style = { ...defaultStyle };

    if (options?.data) {
      this.set(options.data);
    }

    this.attach();
  }
}
