# Debug Web

Paquete NPM de utilidad de depuración para navegadores con niveles de registro configurables (log, warn, error, debug).\
Ligero y fácil de usar.

**Ventajas**:
- 🚀 **Sin dependencias** — solo TypeScript puro;
- 📦 **Peso ~3.0 kB** — impacto mínimo en el bundle;
- 🏅 **Calificación `A` de SonarQube** — máxima calidad y fiabilidad del código;
- 🎨 **Estilización de salida de consola** — formato coloreado para identificación rápida;
- 💾 **Almacenamiento global** — accede a datos de depuración mediante `window`.

---

## Tabla de Contenidos 📑

- [Instalación](#instalación-)
- [Niveles de Registro](#niveles-de-registro-)
- [Opciones](#opciones-)
- [Estilos por Defecto](#estilos-por-defecto-)
- [Cómo Usar](#cómo-usar-)
- [Personalización de Estilos](#personalización-de-estilos-)
- [API](#api-)
- [Extensión de Funcionalidad](#extensión-de-funcionalidad)

## Traducciones

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Instalación 📦

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Niveles de Registro 🔧

Prioridad (de menor a mayor):

1. `debug` (0) — información de depuración (`console.debug`);
2. `log` (1) — mensajes básicos (`console.log`)
3. `info` (2) — mensajes informativos (`console.info`)
4. `warn` (3) —  advertencias (`console.warn`)
5. `error` (4) — errores (`console.error`)

ℹ️ Niveles personalizados: cualquier valor de cadena (incluyendo `success`) se tratará como nivel `info`.

## Opciones ⚙️

| Parámetro | Tipo                            | Por Defecto                        | Descripción                                                               |
|-----------|---------------------------------|------------------------------------|---------------------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'__web_debug__'`                  | Nombre único de la app para separar datos de diferentes aplicaciones      |
| `level`   | `DebugLogLevel`                 | `'log'`                            | Nivel mínimo de registro (mensajes por debajo no se imprimen)             |
| `prop`    | `string` \| `null`              | `'info'`                           | Nombre de la variable global para acceder a datos mediante `window[prop]` |
| `data`    | `Record<string, unknown>`       | —                                  | Datos de depuración iniciales guardados tras la inicialización            |
| `style`   | `Record<DebugLogLevel, string>` | ver [abajo](#estilos-por-defecto-) | Estilos CSS personalizados para mensajes de diferentes niveles            |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Estilos por Defecto 🎨

| Nivel     | Estilo (CSS)                                                               |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `warn`    | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `error`   | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

## Cómo Usar 💡

### Inicialización

Se llama una vez en el punto de entrada de la aplicación (`main.js` / `app.js`):

```javascript
import { debugInit } from 'debug-web';

debugInit({
  level: isDev ? 'debug' : 'error',
  data: { version: env.VERSION, buildTime: env.BUILD_TIMESTAMP }
});
```

### Registro

Usa en cualquier parte de la aplicación para mostrar mensajes:

```javascript
import { debug, log, info, success, warn, error } from 'debug-web';

debug('Mensaje de depuración');
log('Mensaje regular');
info('Mensaje informativo');
success('¡Éxito!');
warn('¡Advertencia!');
error(new Error());
```

### Datos de Depuración

Guarda datos de depuración que serán accesibles mediante una variable global:

```javascript
import { debugData } from 'debug-web';

debugData({ lastError: null, prevRoute: '/home', bus: ['ui:modal-opened'] });
```

💡 Consejo: En DevTools, escribe `info` (u otro valor de `prop`) para obtener todos los datos guardados.

## Personalización de Estilos 🖌️

```javascript
import { debugSetStyle } from 'debug-web';

// Cambiar estilo para un nivel específico
debugSetStyle('info', 'color: purple; font-weight: bold;');

// O cambiar varios niveles a la vez
debugSetStyle({ info: 'color: #9b59b6;', success: 'color: #27ae60;' });
```

## API 📚

### Métodos de Registro

Se soportan todos los métodos principales de `console`:

- `debug`, `log`, `info`, `warn`, `error`;
- `group` (`groupCollapsed`), `groupEnd`;
- `trace`, `count`, `countReset`;
- `time`, `timeLog`, `timeEnd`;
- `dir`, `dirxml`, `table`.

### Métodos Auxiliares

- `debugData` — Agregar datos de depuración (se fusiona con los existentes);
- `debugSetStyle` — Cambiar estilos CSS para niveles de registro;
- `debugGetStyle` — Obtener configuración actual de estilos;
- `debugReset`.

## Extensión de Funcionalidad

Puedes crear tu propia clase para agregar métodos de registro personalizados:

```ts
export class CustomDebug extends WebDebug {
  static {
    // Agregar nuevo estilo para nivel personalizado
    CustomDebug.setStyle({ ...WebDebug._style, 'customEvent': 'color: #00ff00' });
  }

  // Crear un nuevo método de registro
  static customEvent(...attrs: unknown[]) {
    // Verificar si el nivel 'info' (al que se equiparan niveles personalizados) está permitido
    if (!CustomDebug.can('info')) return;

    // Usar método interno para formatear y mostrar
    CustomDebug.print('info', 'customEvent', attrs);
  }
}
```

## Apoyo ❤️

Si encuentras útil esta librería, considera apoyar su desarrollo:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Licencia

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Enlaces
- [📝 Historial de Cambios](CHANGELOG.md)
- [💻 Código Fuente](https://github.com/Karlen-ll/debug-web)
- [🐛 Reportar Errores](https://github.com/Karlen-ll/debug-web/issues)
- [📦 Paquete NPM](https://www.npmjs.com/package/debug-web)
