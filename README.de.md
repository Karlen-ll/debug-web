# Debug Web

NPM-Paket als Browser-Debug-Hilfsprogramm mit konfigurierbaren Log-Levels (log, warn, error, debug).\
Leichtgewichtig und einfach zu verwenden.

**Vorteile**:
- 🚀 **Keine Abhängigkeiten** — nur reines TypeScript;
- 📦 **Größe ~3.0 kB** — minimaler Einfluss auf das Bundle;
- 🏅 **SonarQube `A`-Bewertung** — höchste Codequalität und Zuverlässigkeit;
- 🎨 **Konsole-Ausgabe-Styling** — farbige Formatierung für schnelle Identifizierung;
- 💾 **Globale Speicherung** — Zugriff auf Debug-Daten über `window`.

---

## Inhaltsverzeichnis 📑

- [Installation](#installation-)
- [Log-Level](#log-level-)
- [Optionen](#optionen-)
- [Standardstile](#standardstile-)
- [Verwendung](#verwendung-)
- [Stilanpassung](#stilanpassung-)
- [API](#api-)
- [Erweiterung der Funktionalität](#erweiterung-der-funktionalität)

## Übersetzungen

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Installation 📦

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Log-Level 🔧

Priorität (niedrig nach hoch):

1. `debug` (0) — Debug-Informationen (`console.debug`);
2. `log` (1) — Grundlegende Nachrichten (`console.log`);
3. `info` (2) — Informationelle Nachrichten (`console.info`);
4. `warn` (3) —  Warnungen (`console.warn`);
5. `error` (4) — Fehler (`console.error`).

ℹ️ Benutzerdefinierte Level: Jeder Zeichenkettenwert (einschließlich `success`) wird als `info`-Level behandelt.

## Optionen ⚙️

| Parameter | Typ                             | Standardwert                   | Beschreibung                                                             |
|-----------|---------------------------------|--------------------------------|--------------------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'__web_debug__'`              | Eindeutiger App-Name zur Trennung von Daten verschiedener Anwendungen    |
| `level`   | `DebugLogLevel`                 | `'log'`                        | Minimales Log-Level (Nachrichten darunter werden nicht ausgegeben)       |
| `prop`    | `string` \| `null`              | `'info'`                       | NName der globalen Variable für Datenzugriff über `window[prop]`         |
| `data`    | `Record<string, unknown>`       | —                              | Initiale Debug-Daten, die sofort nach Initialisierung gespeichert werden |
| `style`   | `Record<DebugLogLevel, string>` | siehe [unten](#standardstile-) | Benutzerdefinierte CSS-Stile für Nachrichten verschiedener Level         |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Standardstile 🎨

| Level     | Stil (CSS)                                                                 |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `warn`    | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `error`   | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

## Verwendung 💡

### Initialisierung

Einmalig am Einstiegspunkt der Anwendung aufrufen (`main.js` / `app.js`):

```javascript
import { debugInit } from 'debug-web';

debugInit({
  level: isDev ? 'debug' : 'error',
  data: { version: env.VERSION, buildTime: env.BUILD_TIMESTAMP }
});
```

### Protokollierung

Überall in der Anwendung verwenden, um Nachrichten auszugeben:

```javascript
import { debug, log, info, success, warn, error } from 'debug-web';

debug('Debug-Nachricht');
log('Reguläre Nachricht');
info('Informationelle Nachricht');
success('Erfolg!');
warn('Warnung!');
error(new Error());
```

### Debug-Daten

Debug-Daten speichern, die über eine globale Variable zugänglich sind:

```javascript
import { debugData } from 'debug-web';

debugData({ lastError: null, prevRoute: '/home', bus: ['ui:modal-opened'] });
```
💡 Tipp: Gib in DevTools `info` (oder einen anderen `prop`-Wert) ein, um alle gespeicherten Daten zu erhalten.

## Stilanpassung 🖌️

```javascript
import { debugSetStyle } from 'debug-web';

// Stil für bestimmtes Level ändern
debugSetStyle('info', 'color: purple; font-weight: bold;');

// Oder mehrere Level gleichzeitig ändern
debugSetStyle({ info: 'color: #9b59b6;', success: 'color: #27ae60;' });
```

## API 📚

### Protokollierungsmethoden

Alle wichtigen `console`-Methoden werden unterstützt:

- `debug`, `log`, `info`, `warn`, `error`;
- `group` (`groupCollapsed`), `groupEnd`;
- `trace`, `count`, `countReset`;
- `time`, `timeLog`, `timeEnd`;
- `dir`, `dirxml`, `table`.

### Hilfsmethoden

- `debugData` — Hinzufügen von Debug-Daten (mit vorhandenen zusammengeführt);
- `debugSetStyle` — Ändern von CSS-Stilen für Log-Level;
- `debugGetStyle` — Abrufen aktueller Stileinstellungen;
- `debugReset`.

## Erweiterung der Funktionalität

Sie können eine eigene Klasse erstellen, um benutzerdefinierte Protokollierungsmethoden hinzuzufügen:

```ts
export class CustomDebug extends WebDebug {
  static {
    // Neuen Stil für benutzerdefiniertes Level hinzufügen
    CustomDebug.setStyle({ ...WebDebug._style, 'customEvent': 'color: #00ff00' });
  }

  // Neue Protokollierungsmethode erstellen
  static customEvent(...attrs: unknown[]) {
    // Prüfen, ob 'info'-Level (dem benutzerdefinierte Level gleichgesetzt werden) erlaubt ist
    if (!CustomDebug.can('info')) return;

    // Interne Methode für Formatierung und Ausgabe verwenden
    CustomDebug.print('info', 'customEvent', attrs);
  }
}
```

## Unterstützung ❤️

Wenn Sie diese Bibliothek nützlich finden, erwägen Sie eine Unterstützung der Entwicklung:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Lizenz

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Links
- [📝 Änderungsprotokoll](CHANGELOG.md)
- [💻 Quellcode](https://github.com/Karlen-ll/debug-web)
- [🐛 Fehlermeldungen](https://github.com/Karlen-ll/debug-web/issues)
- [📦 NPM-Paket](https://www.npmjs.com/package/debug-web)
