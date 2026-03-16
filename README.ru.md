# Debug Web

NPM-пакет для отладки в браузере с настраиваемыми уровнями логирования (log, warn, error, debug).\
Легковесный и простой в использовании.

**Преимущества**:
- 🚀 **Нет зависимостей** — только чистый TypeScript;
- 📦 **Вес ~3.5 kB** — минимальное влияние на бандл;
- 🏅 **Рейтинг SonarQube `A`** — высший уровень качества кода и надёжности;
- 🎨 **Стилизация console-выводов** — цветное форматирование для быстрой идентификации;
- 💾 **Глобальное хранилище** — доступ к отладочным данным через `window`;
- 🔧 **Гибкая настройка** — уровни логирования, стили, алиасы, возможность наследования.

---

## Оглавление 📑

- [Установка](#установка-)
- [Уровни логирования](#уровни-логирования-)
- [Опции](#опции-)
- [API](#api-)
  - [createDebug](#функция-createdebug)
  - [Методы логирования](#методы-логирования)
  - [Работа с данными](#работа-с-данными)
  - [Управление уровнем](#управление-уровнем)
- [Отладочные данные](#отладочные-данные)
- [Поддержка](#поддержка-)
- [Лицензия](#лицензия)

## Переводы

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Установка 📦

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Уровни логирования 🔧

Приоритет (от низкого к высокому):

1. `debug` (0) — отладочная информация (`console.debug`);
2. `log` (1) — базовые сообщения (`console.log`)
3. `info` (2) — информационные сообщения (`console.info`)
4. `warn` (3) — предупреждения (`console.warn`)
5. `error` (4) — ошибки (`console.error`)

ℹ️ Пользовательские уровни: любые строковые значения (например, `success`, `focus`) обрабатываются особым образом:
- Обычные пользовательские уровни (без префикса подчеркивания) используют уровень `info`
- Уровни, начинающиеся с подчеркивания (например, `_info`, `_error`), используют уровень `debug`
  Оба типа могут иметь собственные стили.

## Опции ⚙️

| Параметр | Тип                             | По умолчанию                     | Описание                                                                   |
|----------|---------------------------------|----------------------------------|----------------------------------------------------------------------------|
| `app`    | `string` \| `null`              | `'_debug_web'`                   | Уникальное имя приложения для разделения данных                            |
| `level`  | `DebugLogLevel`                 | `'log'`                          | Минимальный уровень логирования (сообщения ниже этого уровня не выводятся) |
| `prop`   | `string` \| `null`              | `'debug'`                        | Имя глобальной переменной для доступа к данным (`null` — не создавать)     |
| `data`   | `Record<string, unknown>`       | —                                | Начальные отладочные данные                                                |
| `local`  | `boolean`                       | `false`                          | Сохранять уровень в `localStorage` (иначе `sessionStorage`)                |
| `native` | `boolean`                       | `false`                          | Использовать нативные методы консоли (без стилей)                          |
| `alias`  | `Record<string, DebugLogLevel>` | `{}`                             | Пользовательские алиасы для `createDebug`                                  |
| `title`  | `Record<string, string>`        | `undefined`                      | Заголовки для пользовательских уровней логирования                         |
| `style`  | `Record<DebugLogLevel, string>` | см. [ниже](#стили-по-умолчанию-) | CSS-стили для уровлей логирования                                          |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Стили по умолчанию 🎨

| Уровень   | Стиль (CSS)                                                                |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `mark`    | `background-color: #695aff; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `focus`   | `background-color: #881798; color: #fff; padding: 2px; border-radius: 3px` |
| `alert`   | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `danger`  | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

### Алиасы по умолчанию

`d` → `debug`, `l` → `log`, `i` → `info`, `w` → `warn`, `e` → `error`

## Как использовать 💡

### Создание экземпляра

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

#### Функция `createDebug`

Создаёт прокси с алиасами и поддержкой кастомных уровней.

```typescript
<T extends typeof DebugWeb>( options?: CreateDebugOptions, DebugClass?: T ) => CustomLogLevels & InstanceType<T>;
```

#### Методы логирования

| Уровень      | Тип                                                                    |
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

#### Работа с данными

| Метод  | Тип                                               | Комментарий                                                                           |
|--------|---------------------------------------------------|---------------------------------------------------------------------------------------|
| `set`  | `(data: DebugWebData) => void`                    | Сохраняет отладочные данные (объединяет)                                              |
| `get`  | `(api?: boolean) => DebugWebData  \| undefined`   | Возвращает копию всех данных. Если передать `true` — добавляет вспомогательные методы |
| `dump` | `(keys: string[], options?: DumpOptions) => void` | Выводит данные в виде таблицы (игнорирует уровни логирования)                         |


```typescript
type DebugWebData = Record<string, unknown>

type DumpOptions = {
  level?: DebugLogLevel;
  title?: string | ((data: DebugWebData) => string);
  open?: boolean;
}
```

#### Управление уровнем

| Метод            | Тип             | Комментарий                          |
|------------------|-----------------|--------------------------------------|
| `level` (getter) | `DebugLogLevel` | Получить текущий уровень логирвоания |
| `level` (setter) | `DebugLogLevel` | Задать уровень логирвоания           |

#### Стилизация

| Метод            | Тип                               | Комментарий                              |
|------------------|-----------------------------------|------------------------------------------|
| `style` (getter) | `() => DebugWebStyle`             | Получить карту стилей                    |
| `style` (setter) | `(styles: DebugWebStyle) => void` | Обновить карту стилей (будет объединена) |

```typescript
type DebugWebStyle = Record<DebugLogLevel, string | undefined>
```

### Отладочные данные

Сохраняйте любые данные и просматривайте их в консоли:

```javascript
debug.set({ error: null, user: { id: 1, name: 'John' } });
```

Данные доступны через `window[prop]` (по умолчанию `debug`).\
Введите в консоль браузера:

```javascript
  debug // { error: null, user: {...}, setLevel: f }
  debug.setLevel() // изменить уровень логирования
```

## Поддержка ❤️

Если эта библиотека полезна для вас, рассмотрите возможность поддержать её разработку:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Лицензия

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Ссылки
- [📝 История изменений](CHANGELOG.md)
- [💻 Исходный код](https://github.com/Karlen-ll/debug-web)
- [🐛 Отчеты об ошибках](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM пакет](https://www.npmjs.com/package/debug-web)
