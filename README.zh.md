# Debug Web

用于浏览器调试的 NPM 包，具有可自定义的日志级别（log、warn、error、debug）。\
轻量且易于使用。

**特点**:
- 🚀 **无依赖** — 纯 TypeScript 编写；
- 📦 **体积 ~3.5 kB** — 对打包体积影响极小；
- 🏅 **SonarQube `A` 评级** — 最高级别的代码质量和可靠性；
- 🎨 **控制台输出样式** — 彩色格式化，便于快速识别；
- 💾 **全局存储** — 通过 `window` 访问调试数据；
- 🔧 **灵活配置** — 支持日志级别、样式、别名及继承。

---

## 目录 📑

- [安装](#安装-)
- [日志级别](#日志级别-)
- [选项](#选项-)
- [API](#api-)
  - [createDebug](#createdebug-函数)
  - [日志记录方法](#日志记录方法)
  - [数据处理](#数据处理)
  - [级别管理](#级别管理)
- [调试数据](#调试数据)
- [支持](#支持-)
- [许可证](#许可证)

## 翻译版本

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## 安装 📦

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## 日志级别 🔧

优先级（从低到高）：

1. `debug` (0) — 调试信息 (`console.debug`);
2. `log` (1) — 基础消息 (`console.log`)
3. `info` (2) — 提示信息 (`console.info`)
4. `warn` (3) — 警告 (`console.warn`)
5. `error` (4) — 错误 (`console.error`)

ℹ️ 自定义级别：任何字符串值（例如 `success`、`focus`）都将作为 `info` 级别处理，并且可以拥有独立的样式。

## 选项 ⚙️

| 参数       | 类型                              | 默认值            | 描述                                              |
|----------|---------------------------------|----------------|-------------------------------------------------|
| `app`    | `string` \| `null`              | `'_debug_web'` | 唯一的应用程序名称，用于分离数据                                |
| `level`  | `DebugLogLevel`                 | `'log'`        | 最低日志级别（低于此级别的消息将不会输出）                           |
| `prop`   | `string` \| `null`              | `'debug'`      | 用于访问数据的全局变量名（`null` — 不创建）                      |
| `data`   | `Record<string, unknown>`       | —              | 初始调试数据                                          |
| `local`  | `boolean`                       | `false`        | 将级别保存在 `localStorage` 中（否则保存在 `sessionStorage`） |
| `native` | `boolean`                       | `false`        | 使用原生控制台方法（不带样式）                                 |
| `alias`  | `Record<string, DebugLogLevel>` | `{}`           | `createDebug` 的自定义别名                            |
| `title`  | `Record<string, string>`        | `undefined`    | 自定义日志级别的标题                                      |
| `style`  | `Record<DebugLogLevel, string>` | 见 [下方](#默认样式-) | 日志级别的 CSS 样式                                    |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### 默认样式 🎨

| 级别        | 样式 (CSS)                                                                   |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `mark`    | `background-color: #695aff; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `focus`   | `background-color: #881798; color: #fff; padding: 2px; border-radius: 3px` |
| `alert`   | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `danger`  | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

### 默认别名

`d` → `debug`, `l` → `log`, `i` → `info`, `w` → `warn`, `e` → `error`

## 如何使用 💡

### 创建实例

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

#### `createDebug` 函数

创建一个支持别名和自定义级别的代理。

```typescript
<T extends typeof DebugWeb>( options?: CreateDebugOptions, DebugClass?: T ) => CustomLogLevels & InstanceType<T>;
```

#### 日志记录方法

| 级别           | 类型                                                                     |
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

#### 数据处理

| 方法     | 类型                                                | 注释                            |
|--------|---------------------------------------------------|-------------------------------|
| `set`  | `(data: DebugWebData) => void`                    | 保存调试数据（合并数据）                  |
| `get`  | `(api?: boolean) => DebugWebData  \| undefined`   | 返回所有数据的副本。如果传入 `true`，则添加辅助方法 |
| `dump` | `(keys: string[], options?: DumpOptions) => void` | 以表格形式输出数据（忽略日志级别）             |


```typescript
type DebugWebData = Record<string, unknown>

type DumpOptions = {
  level?: DebugLogLevel;
  title?: string | ((data: DebugWebData) => string);
  open?: boolean;
}
```

#### 级别管理

| 方法               | 类型              | 注释       |
|------------------|-----------------|----------|
| `level` (getter) | `DebugLogLevel` | 获取当前日志级别 |
| `level` (setter) | `DebugLogLevel` | 设置当前日志级别 |

#### 样式设置

| 方法               | 类型                                | 注释           |
|------------------|-----------------------------------|--------------|
| `style` (getter) | `() => DebugWebStyle`             | 获取当前样式映射表    |
| `style` (setter) | `(styles: DebugWebStyle) => void` | 更新样式映射表（将合并） |

```typescript
type DebugWebStyle = Record<DebugLogLevel, string | undefined>
```

### 调试数据

保存任意数据并在控制台中查看：

```javascript
debug.set({ error: null, user: { id: 1, name: 'John' } });
```

可以通过 `window[prop]`（默认是 `debug`）访问数据。
在浏览器控制台中输入：

```javascript
  debug // { error: null, user: {...}, setLevel: f }
  debug.setLevel() // 修改日志级别
```

## 支持 ❤️

如果这个库对您有帮助，请考虑支持它的开发。

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## 许可证

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## 链接
- [📝 更新日志](CHANGELOG.md)
- [💻 源代码](https://github.com/Karlen-ll/debug-web)
- [🐛 问题反馈](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM 包](https://www.npmjs.com/package/debug-web)
