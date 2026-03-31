import { DebugWeb, createDebug, DebugWebOptions } from '../src'; // use from 'debug-web'

const isDev = process.env.NODE_ENV === 'development';

/**
 * Examples of inheritance
 * @desc Saving to a file
 */
export class DebugWebSupport extends DebugWeb {
  constructor(options?: DebugWebOptions) {
    super(options);
  }

  init(options?: DebugWebOptions) {
    super.init(options);
    this._fns = { ...this._fns, download: this.download }; // ← adding a method for downloading a file to the console
  }

  blob(options?: BlobPropertyBag) {
    // sessionStorage — because methods that access storage in get and set methods use sessionStorage
    return new Blob([JSON.stringify({
      ...this.get(),
      'sessionStorage': this.get(true)
    }, null, 2)], { type: 'application/json', ...options });
  }

  file(filename = this._id, options?: BlobPropertyBag) {
    const blob = this.blob(options);
    return new File([blob], filename, { type: blob.type, lastModified: Date.now() });
  }

  download(options?: BlobPropertyBag) {
    const blob = this.blob(options);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = this._id;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Helper information for ease of use
 * @methods Styled methods: `info`, `mark`, `success`, `focus`, `alert`, `danger`
 */
export const debug = createDebug({
  level: isDev ? 'log' : 'error',
  data: { version: process.env.APP_VERSION, message: process.env.APP_MESSAGE, time: process.env.APP_BUILD_TIME },
}, DebugWebSupport);

if (process.env.APP_INFO) {
  /** Display welcome information in the console */
  debug.dump(['message', 'time'], { level: 'info' });
}
