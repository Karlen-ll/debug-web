# Debug Web
轻量级浏览器调试库。

**优点**:
- 🚀 **无依赖** — 仅使用纯 TypeScript;
- 📦 **大小约 3.0 kB** — 对打包体积影响极小;
- 🎨 **控制台输出样式** — 彩色格式化，便于快速识别;
- 💾 **全局存储** — 通过 `window` 访问调试数据。

---

## 目录 📑

- [安装](#安装-)
- [日志级别](#日志级别-)
- [选项](#选项-)
- [默认样式](#默认样式-)
- [使用方法](#使用方法-)
- [样式自定义](#样式自定义-)
- [API](#api-)
- [扩展功能](#扩展功能)

## 其他语言版本

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

优先级（从低到高）:

1. `debug` (0) — 调试信息 (`console.debug`);
2. `log` (1) — 基本消息 (`console.log`)
3. `info` (2) — 信息性消息 (`console.info`)
4. `warn` (3) — 警告 (`console.warn`)
5. `error` (4) — 错误 (`console.error`)

ℹ️ 自定义级别: 任何字符串值（包括 `success`）都将被视为 `info` 级别。

## 选项 ⚙️

| 参数      | 类型                              | 默认值               | 描述                                |
|---------|---------------------------------|-------------------|-----------------------------------------|
| `app`   | `string` \| `null`              | `'__web_debug__'` | 用于区分不同应用数据的唯一应用名称            |
| `level` | `DebugLogLevel`                 | `'log'`           | 最低日志级别（低于此级别的消息不会打印）       |
| `prop`  | `string` \| `null`              | `'info'`          | 用于通过 `window[prop]` 访问数据的全局变量名 |
| `data`  | `Record<string, unknown>`       | —                 | 初始化后立即保存的初始调试数据               |
| `style` | `Record<DebugLogLevel, string>` | 参见 [下方](#默认样式-)   | 为不同级别的消息自定义 CSS 样式        |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### 默认样式 🎨

| 级别        | 样式 (CSS)                                                                   |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `warn`    | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `error`   | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

## 使用方法 💡

### 初始化

在应用程序入口点（`main.js` / `app.js`）调用一次:

```javascript
import { debugInit } from 'debug-web';

debugInit({
  level: isDev ? 'debug' : 'error',
  data: { version: env.VERSION, buildTime: env.BUILD_TIMESTAMP }
});
```

### 日志记录

在应用程序的任何位置使用以输出消息:

```javascript
import { debug, log, info, success, warn, error } from 'debug-web';

debug('调试消息');
log('常规消息');
info('信息性消息');
success('成功！');
warn('警告！');
error(new Error());
```

### 调试数据

保存调试数据，可通过全局变量访问:

```javascript
import { debugData } from 'debug-web';

debugData({ lastError: null, prevRoute: '/home', bus: ['ui:modal-opened'] });
```

💡 提示: 在 DevTools 中输入 `info`（或其他 `prop` 值）以获取所有保存的数据。

## 样式自定义 🖌️

```javascript
import { debugSetStyle } from 'debug-web';

// 更改特定级别的样式
debugSetStyle('info', 'color: purple; font-weight: bold;');

// 或同时更改多个级别
debugSetStyle({ info: 'color: #9b59b6;', success: 'color: #27ae60;' });
```

## API 📚

### 日志方法

支持所有主要的 `console` 方法:

- `debug`, `log`, `info`, `warn`, `error`;
- `group` (`groupCollapsed`), `groupEnd`;
- `trace`, `count`, `countReset`;
- `time`, `timeLog`, `timeEnd`;
- `dir`, `dirxml`, `table`.

### 辅助方法

- `debugData` — 添加调试数据（与现有数据合并）;
- `debugSetStyle` — 更改日志级别的 CSS 样式;
- `debugGetStyle` — 获取当前样式设置;
- `debugReset`.

## 扩展功能

您可以创建自己的类以添加自定义日志方法:

```ts
export class CustomDebug extends WebDebug {
  static {
    // 为自定义级别添加新样式
    CustomDebug.setStyle({ ...WebDebug._style, 'customEvent': 'color: #00ff00' });
  }

  // 创建新的日志方法
  static customEvent(...attrs: unknown[]) {
    // 检查是否允许 'info' 级别（自定义级别等同于该级别）
    if (!CustomDebug.can('info')) return;

    // 使用内部方法进行格式化和输出
    CustomDebug.print('info', 'customEvent', attrs);
  }
}
```

## 支持

如果您觉得这个库有用，请考虑支持其开发：

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## 许可证

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## 链接
- [📝 更新日志](CHANGELOG.md)
- [💻 源代码](https://github.com/Karlen-ll/debug-web)
- [🐛 问题反馈](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM 包](https://www.npmjs.com/package/debug-web)
