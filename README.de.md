# Debug Web

NPM-Paket für das Debugging im Browser mit anpassbaren Protokollierungsebenen (log, warn, error, debug).\
Leichtgewichtig und einfach zu bedienen.

**Eigenschaften**:

- **Keine Abhängigkeiten** — reines TypeScript;
- **Größe ~3.5 kB** — minimaler Einfluss auf Ihr Bundle;
- **SonarQube `A` Bewertung** — höchstes Maß an Codequalität und Zuverlässigkeit;
- **Konsolen-Styling** — farbliche Formatierung zur schnellen Identifikation;
- **Globaler Speicher** — Zugriff auf Debug-Daten über `window`;
- **Flexible Konfiguration** — Protokollierungsebenen, Stile, Aliase, Unterstützung von Vererbung.

---

## Inhaltsverzeichnis

- [Installation](#installation)
- [Protokollierungsebenen](#protokollierungsebenen)
- [Optionen](#optionen)
- [API](#api)
  - [createDebug](#funktion-createdebug)
  - [Protokollierungsmethoden](#protokollierungsmethoden)
  - [Datenverarbeitung](#datenverarbeitung)
  - [Ebenenverwaltung](#ebenenverwaltung)
- [Debug-Daten](#debug-daten)
- [Unterstützung](#unterstützung)
- [Lizenz](#lizenz)

## Übersetzungen

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Installation

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Protokollierungsebenen

Priorität (niedrig nach hoch):

1. `debug` (0) — Debug-Informationen (`console.debug`);
2. `log` (1) — Grundlegende Nachrichten (`console.log`);
3. `info` (2) — Informationelle Nachrichten (`console.info`);
4. `warn` (3) — Warnungen (`console.warn`);
5. `error` (4) — Fehler (`console.error`).

ℹ️ Benutzerdefinierte Ebenen: beliebige Zeichenfolgen (z.B. `success`, `focus`) werden mit spezifischem Verhalten
verarbeitet:

- Reguläre benutzerdefinierte Ebenen (ohne Unterstrich-Präfix) verwenden die `info`-Ebene
- Ebenen, die mit Unterstrich beginnen (z.B. `_info`, `_error`), verwenden die `debug`-Ebene
  Beide können eigene Stile haben.

## Optionen

| Parameter | Typ                             | Standard                        | Beschreibung                                                                 |
|-----------|---------------------------------|---------------------------------|------------------------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'debug'`                       | Eindeutiger App-Name zur Trennung von Daten                                  |
| `level`   | `DebugLogLevel`                 | `'log'`                         | Minimale Protokollierungsebene (Nachrichten darunter werden nicht angezeigt) |
| `prop`    | `string` \| `null`              | `'debug'`                       | Globaler Variablenname für Datenzugriff (`null` — nicht erstellen)           |
| `data`    | `Record<string, unknown>`       | —                               | Initiale Debug-Daten                                                         |
| `local`   | `boolean`                       | `false`                         | Ebene in `localStorage` speichern (sonst `sessionStorage`)                   |
| `native`  | `boolean`                       | `false`                         | Native Konsolenmethoden (ohne Stile) verwenden                               |
| `title`   | `Record<string, string>`        | `undefined`                     | Titel für benutzerdefinierte Protokollierungsebenen                          |
| `alias`   | `Record<string, DebugLogLevel>` | siehe [unten](#standard-aliase) | Benutzerdefinierte Aliase für `createDebug`                                  |
| `style`   | `Record<DebugLogLevel, string>` | siehe [unten](#standardstile)   | CSS-Stile für die Protokollierungsebenen                                     |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Standardstile

| Ebene     | Stil (CSS)                                                                 |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `mark`    | `background-color: #695aff; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `focus`   | `background-color: #881798; color: #fff; padding: 2px; border-radius: 3px` |
| `alert`   | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `danger`  | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

### Standard-Aliase

`d` → `debug`, `l` → `log`, `i` → `info`, `w` → `warn`, `e` → `error`

## Verwendung

### Erstellen einer Instanz

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

### API

#### Funktion `createDebug`

Erstellt einen Proxy mit Aliasen und Unterstützung für benutzerdefinierte Ebenen.

```typescript
<T extends typeof DebugWeb>(options?: CreateDebugOptions, DebugClass?: T) => CustomLogLevels & InstanceType<T>;
```

#### Protokollierungsmethoden

| Ebene        | Typ                                                                    |
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

#### Datenverarbeitung

| Methode | Typ                                               | Kommentar                                                                       |
|---------|---------------------------------------------------|---------------------------------------------------------------------------------|
| `set`   | `(data: DebugWebData) => void`                    | Speichert Debug-Daten (zusammenführen)                                          |
| `get`   | `(api?: boolean) => DebugWebData  \| undefined`   | Gibt eine Kopie aller Daten zurück. Bei `true` werden Hilfsmethoden hinzugefügt |
| `dump`  | `(keys: string[], options?: DumpOptions) => void` | Gibt Daten als Tabelle aus (ignoriert Protokollierungsebenen)                   |

```typescript
type DebugWebData = Record<string, unknown>

type DumpOptions = {
  level?: DebugLogLevel;
  title?: string | ((data: DebugWebData) => string);
  open?: boolean;
}
```

#### Ebenenverwaltung

| Methode          | Typ             | Kommentar                                |
|------------------|-----------------|------------------------------------------|
| `level` (getter) | `DebugLogLevel` | Aktuelle Protokollierungsebene abrufen   |
| `level` (setter) | `DebugLogLevel` | Aktuelle Protokollierungsebene festlegen |

#### Styling

| Methode          | Typ                               | Kommentar                                          |
|------------------|-----------------------------------|----------------------------------------------------|
| `style` (getter) | `() => DebugWebStyle`             | Aktuelle Stilzuordnung abrufen                     |
| `style` (setter) | `(styles: DebugWebStyle) => void` | Stilzuordnung aktualisieren (wird zusammengeführt) |

```typescript
type DebugWebStyle = Record<DebugLogLevel, string | undefined>
```

### Debug-Daten

Speichern Sie beliebige Daten und betrachten Sie sie in der Konsole:

```javascript
debug.set({ error: null, user: { id: 1, name: 'John' } });
```

Daten sind über `window[prop]` (Standard ist `debug`) zugänglich.
Geben Sie in der Browserkonsole ein:

```javascript
debug // { error: null, user: {...}, setLevel: f }
debug.setLevel() // Protokollierungsebene ändern
```

## Unterstützung

Wenn diese Bibliothek für Sie nützlich ist, ziehen Sie bitte in Betracht, ihre Entwicklung zu unterstützen:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Lizenz

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Links

- [📝 Änderungsprotokoll](CHANGELOG.md)
- [💻 Quellcode](https://github.com/Karlen-ll/debug-web)
- [🐛 Fehlermeldungen](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM-Paket](https://www.npmjs.com/package/debug-web)
