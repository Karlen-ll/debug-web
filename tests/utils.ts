import { DebugWeb } from '@/debugWeb';
import { isSSR, getWindowKey } from '@/utils';
import type { DebugWebOptions } from '@/types';

export class TestDebugWeb extends DebugWeb {
  constructor(options?: DebugWebOptions) {
    super(options);
  }

  reset(options?: DebugWebOptions) {
    if (!isSSR()) {
      delete window[getWindowKey(this._id)];

      if (this._prp) {
        delete window[getWindowKey(this._prp, true)];
      }
    }

    this.init(options);
    this.attach();
  }
}
