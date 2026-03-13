import { DebugWeb } from '@/debugWeb';
import { isSSR, getWindowKey } from '@/utils';
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

    this.init(options);
    this.attach();
  }
}
