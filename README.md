# Debug Web
Lightweight browser debugging library.

**Advantages**:
- 🚀 **No dependencies** — pure TypeScript only;
- 📦 **Size ~3.0 kB** — minimal bundle impact;
- 🎨 **Console output styling** — colored formatting for quick identification;
- 💾 **Global storage** — access debug data via `window`.

---

## Table of Contents 📑

- [Installation](#installation-)
- [Log Levels](#log-levels-)
- [Options](#options-)
- [Default Styles](#default-styles-)
- [How to Use](#how-to-use-)
- [Style Customization](#style-customization-)
- [API](#api-)
- [Extending Functionality](#extending-functionality)

## Other Language Versions

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Installation 📦

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Log Levels 🔧

Priority (lowest to highest):

1. `debug` (0) — debug information (`console.debug`);
2. `log` (1) — basic messages (`console.log`)
3. `info` (2) — informational messages (`console.info`)
4. `warn` (3) —  warnings (`console.warn`)
5. `error` (4) — errors (`console.error`)

ℹ️ Custom levels: any string values (including `success`) will be treated as `info` level.

## Options ⚙️

| Parameter | Type                            | Default                       | Description                                                   |
|-----------|---------------------------------|-------------------------------|---------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'__web_debug__'`             | Unique app name to separate data from different applications  |
| `level`   | `DebugLogLevel`                 | `'log'`                       | Minimum log level (messages below this level are not printed) |
| `prop`    | `string` \| `null`              | `'info'`                      | Name of global variable to access data via `window[prop]`     |
| `data`    | `Record<string, unknown>`       | —                             | Initial debug data saved immediately after initialization     |
| `style`   | `Record<DebugLogLevel, string>` | see [below](#default-styles-) | Custom CSS styles for messages of different levels            |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Default Styles 🎨

| Level     | Style (CSS)                                                                |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `warn`    | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `error`   | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

## How to Use 💡

### Initialization

Called once at the application entry point (`main.js` / `app.js`):

```javascript
import { debugInit } from 'debug-web';

debugInit({
  level: isDev ? 'debug' : 'error',
  data: { version: env.VERSION, buildTime: env.BUILD_TIMESTAMP }
});
```

### Logging

Use anywhere in the application to output messages:

```javascript
import { debug, log, info, success, warn, error } from 'debug-web';

debug('Debug message');
log('Regular message');
info('Informational message');
success('Success!');
warn('Warning!');
error(new Error());
```

### Debug Data

Save debug data that will be accessible via a global variable:

```javascript
import { debugData } from 'debug-web';

debugData({ lastError: null, prevRoute: '/home', bus: ['ui:modal-opened'] });
```

💡 Tip: In DevTools, type `info` (or another `prop` value) to get all saved data.

## Style Customization 🖌️

```javascript
import { debugSetStyle } from 'debug-web';

// Change style for a specific level
debugSetStyle('info', 'color: purple; font-weight: bold;');

// Or change multiple levels at once
debugSetStyle({ info: 'color: #9b59b6;', success: 'color: #27ae60;' });
```

## API 📚

### Logging Methods

All major `console` methods are supported:

- `debug`, `log`, `info`, `warn`, `error`;
- `group` (`groupCollapsed`), `groupEnd`;
- `trace`, `count`, `countReset`;
- `time`, `timeLog`, `timeEnd`;
- `dir`, `dirxml`, `table`.

### Helper Methods

- `debugData` — Adding debug data (merged with existing);
- `debugSetStyle` — Changing CSS styles for log levels;
- `debugGetStyle` — Getting current style settings;
- `debugReset`.

## Extending Functionality

You can create your own class to add custom logging methods:

```ts
export class CustomDebug extends WebDebug {
  static {
    // Add new style for custom level
    CustomDebug.setStyle({ ...WebDebug._style, 'customEvent': 'color: #00ff00' });
  }

  // Create a new logging method
  static customEvent(...attrs: unknown[]) {
    // Check if 'info' level (to which custom levels are equated) is allowed
    if (!CustomDebug.can('info')) return;

    // Use internal method for formatting and output
    CustomDebug.print('info', 'customEvent', attrs);
  }
}
```

## Support

If you find this library useful, consider supporting its development:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## License

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Ссылки
- [📝 Changelog](CHANGELOG.md)
- [💻 Source Code](https://github.com/Karlen-ll/debug-web)
- [🐛 Bug Reports](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM Package](https://www.npmjs.com/package/debug-web)
