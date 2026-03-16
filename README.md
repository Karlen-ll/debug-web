# Debug Web

NPM package for browser debugging with customizable logging levels (log, warn, error, debug).\
Lightweight and easy to use.

**Features**:
- 🚀 **No dependencies** — pure TypeScript only;
- 📦 **Size ~3.5 kB** — minimal impact on your bundle;
- 🏅 **SonarQube `A` Rating** — highest level of code quality and reliability;
- 🎨 **Console output styling** — color formatting for quick identification;
- 💾 **Global storage** — access debug data via `window`;
- 🔧 **Flexible configuration** — logging levels, styles, aliases, inheritance support.

---

## Table of Contents 📑

- [Installation](#installation-)
- [Log levels](#log-levels-)
- [Options](#options-)
- [API](#api-)
  - [createDebug](#createdebug-function)
  - [Logging methods](#logging-methods)
  - [Data handling](#data-handling)
  - [Level management](#level-management)
- [Debug data](#debug-data)
- [Support](#support-)
- [License](#license)

## Languages

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

Priority (from lowest to highest):

1. `debug` (0) — debug information (`console.debug`);
2. `log` (1) — basic messages (`console.log`)
3. `info` (2) — informational messages (`console.info`)
4. `warn` (3) —  warnings (`console.warn`)
5. `error` (4) — errors (`console.error`)

ℹ️ Custom levels: any string values (e.g., `success`, `focus`) will be processed with specific behavior:
- Regular custom levels (without underscore prefix) use the `info` level
- Levels starting with underscore (e.g., `_info`, `_error`) use the `debug` level
  Both can have their own styles.

## Options ⚙️

| Parameter | Type                            | Default                       | Description                                                      |
|-----------|---------------------------------|-------------------------------|------------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'_debug_web'`                | Unique application name to separate data                         |
| `level`   | `DebugLogLevel`                 | `'log'`                       | Minimum logging level (messages below this level are not output) |
| `prop`    | `string` \| `null`              | `'debug'`                     | Global variable name to access data (`null` — do not create)     |
| `data`    | `Record<string, unknown>`       | —                             | Initial debug data                                               |
| `local`   | `boolean`                       | `false`                       | Save level in `localStorage` (otherwise `sessionStorage`)        |
| `native`  | `boolean`                       | `false`                       | Use native console methods (without styles)                      |
| `alias`   | `Record<string, DebugLogLevel>` | `{}`                          | Custom aliases for `createDebug`                                 |
| `title`   | `Record<string, string>`        | `undefined`                   | Titles for custom log levels                                     |
| `style`   | `Record<DebugLogLevel, string>` | see [below](#default-styles-) | CSS styles for log levels                                        |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Default styles 🎨

| Level     | Style (CSS)                                                                |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `mark`    | `background-color: #695aff; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `focus`   | `background-color: #881798; color: #fff; padding: 2px; border-radius: 3px` |
| `alert`   | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `danger`  | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

### Default aliases

`d` → `debug`, `l` → `log`, `i` → `info`, `w` → `warn`, `e` → `error`

## How to use 💡

### Creating an instance

```typescript
// debug.ts
import { DebugWeb } from 'debug-web';

export const debug = new DebugWeb({
  app: 'my-app',
  level: process.env.NODE_ENV === 'development' ? 'log' : 'error',
  data: { version: APP_VERSION },
  alias: { s: 'success', f: 'focus' },
  local: true,
});
```

### API 📚

#### `createDebug` function

Creates a proxy with aliases and custom level support.

```typescript
<T extends typeof DebugWeb>( options?: CreateDebugOptions, DebugClass?: T ) => CustomLogLevels & InstanceType<T>;
```

#### Logging methods

| Level        | Type                                                                   |
|--------------|------------------------------------------------------------------------|
| `debug`      | `(message?: unknown, ...attrs: unknown[]) => void`                     |
| `log`        | `(...attrs: unknown[]) => void`                                        |
| `info`       | `(...attrs: unknown[]) => void`                                        |
| `warn`       | `(...attrs: unknown[]) => void`                                        |
| `error`      | `(...attrs: unknown[]) => void`                                        |
| `group`      | `(open?: boolean, level?: DebugLogLevel, ...attrs: unknown[]) => void` |
| `groupEnd`   | `(level?: DebugLogLevel) => void`                                      |
| `dir`        | `(value: unknown, options?: unknown) => void`                          |
| `dirxml`     | `(...attrs: unknown[]) => void`                                        |
| `trace`      | `(...attrs: unknown[]) => void`                                        |
| `table`      | `(data: unknown, properties?: string[]) => void`                       |
| `count`      | `(label?: string) => void`                                             |
| `countReset` | `(label?: string) => void`                                             |
| `time`       | `(label?: string) => void`                                             |
| `timeLog`    | `(label?: string, ...attrs: unknown[]) => void`                        |
| `timeEnd`    | `(label?: string) => void`                                             |

#### Data handling

| Method | Type                                              | Comment                                                              |
|--------|---------------------------------------------------|----------------------------------------------------------------------|
| `set`  | `(data: DebugWebData) => void`                    | Saves debug data (merges)                                            |
| `get`  | `(api?: boolean) => DebugWebData  \| undefined`   | Returns a copy of all data. If `true` is passed, adds helper methods |
| `dump` | `(keys: string[], options?: DumpOptions) => void` | Outputs data as a table (ignores logging levels)                     |


```typescript
type DebugWebData = Record<string, unknown>

type DumpOptions = {
  level?: DebugLogLevel;
  title?: string | ((data: DebugWebData) => string);
  open?: boolean;
}
```

#### Level management

| Method           | Type            | Comment                       |
|------------------|-----------------|-------------------------------|
| `level` (getter) | `DebugLogLevel` | Get the current logging level |
| `level` (setter) | `DebugLogLevel` | Set the current logging level |

#### Styling

| Method           | Type                              | Comment                                |
|------------------|-----------------------------------|----------------------------------------|
| `style` (getter) | `() => DebugWebStyle`             | Get the current styles map             |
| `style` (setter) | `(styles: DebugWebStyle) => void` | Update the styles map (will be merged) |

```typescript
type DebugWebStyle = Record<DebugLogLevel, string | undefined>
```

### Debug data

Save any data and view it in the console:

```javascript
debug.set({ error: null, user: { id: 1, name: 'John' } });
```

Data is accessible via `window[prop]` (default is `debug`).
Type into the browser console:

```javascript
  debug // { error: null, user: {...}, setLevel: f }
  debug.setLevel() // change logging level
```

## Support ❤️

If you find this library useful, consider supporting its development:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## License

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Links
- [📝 Changelog](CHANGELOG.md)
- [💻 Source Code](https://github.com/Karlen-ll/debug-web)
- [🐛 Bug Reports](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM Package](https://www.npmjs.com/package/debug-web)
