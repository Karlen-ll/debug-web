# Debug Web

Paquete NPM para depuración en el navegador con niveles de registro personalizables (log, warn, error, debug).\
Ligero y fácil de usar.

**Características**:

- **Sin dependencias** — solo TypeScript puro;
- **Peso ~3.5 kB** — impacto mínimo en tu bundle;
- **Calificación SonarQube `A`** — el nivel más alto de calidad y confiabilidad de código;
- **Estilización de consola** — formato de colores para una identificación rápida;
- **Almacenamiento global** — acceso a los datos de depuración a través de `window`;
- **Configuración flexible** — niveles de registro, estilos, alias, soporte para herencia.

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Niveles de registro](#niveles-de-registro)
- [Opciones](#opciones)
- [API](#api)
  - [createDebug](#función-createdebug)
  - [Métodos de registro](#métodos-de-registro)
  - [Manejo de datos](#manejo-de-datos)
  - [Gestión de niveles](#gestión-de-niveles)
- [Datos de depuración](#datos-de-depuración)
- [Soporte](#soporte)
- [Licencia](#licencia)

## Traducciones

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Instalación

```bash
npm install debug-web
```
```bash
yarn add debug-web
```

## Niveles de registro

Prioridad (de menor a mayor):

1. `debug` (0) — información de depuración (`console.debug`);
2. `log` (1) — mensajes básicos (`console.log`)
3. `info` (2) — mensajes informativos (`console.info`)
4. `warn` (3) — advertencias (`console.warn`)
5. `error` (4) — errores (`console.error`)

ℹ️ Niveles personalizados: cualquier valor de cadena (por ejemplo, `success`, `focus`) se procesará con un
comportamiento específico:

- Los niveles personalizados regulares (sin prefijo de guión bajo) utilizan el nivel `info`
- Los niveles que comienzan con guión bajo (por ejemplo, `_info`, `_error`) utilizan el nivel `debug`
  Ambos pueden tener sus propios estilos.

## Opciones

| Parámetro | Tipo                            | Por defecto                       | Descripción                                                                 |
|-----------|---------------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `app`     | `string` \| `null`              | `'_debug_web'`                    | Nombre único de la aplicación para separar datos                            |
| `level`   | `DebugLogLevel`                 | `'log'`                           | Nivel mínimo de registro (no se muestran mensajes por debajo de este nivel) |
| `prop`    | `string` \| `null`              | `'debug'`                         | Nombre de variable global para acceder a datos (`null` — no crear)          |
| `data`    | `Record<string, unknown>`       | —                                 | Datos iniciales de depuración                                               |
| `local`   | `boolean`                       | `false`                           | Guardar el nivel en `localStorage` (de lo contrario en `sessionStorage`)    |
| `native`  | `boolean`                       | `false`                           | Usar métodos nativos de la consola (sin estilos)                            |
| `title`   | `Record<string, string>`        | `undefined`                       | Títulos para niveles de registro personalizados                             |
| `alias`   | `Record<string, DebugLogLevel>` | ver [abajo](#alias-por-defecto)   | Alias personalizados para `createDebug`                                     |
| `style`   | `Record<DebugLogLevel, string>` | ver [abajo](#estilos-por-defecto) | Estilos CSS para los niveles de registro                                    |

```typescript
type DebugLogLevel = 'debug' | 'log' | 'info' | 'success' | 'warn' | 'error' | string;
```

### Estilos por defecto

| Nivel     | Estilo (CSS)                                                               |
|-----------|----------------------------------------------------------------------------|
| `info`    | `background-color: #155adc; color: #fff; padding: 2px; border-radius: 3px` |
| `mark`    | `background-color: #695aff; color: #fff; padding: 2px; border-radius: 3px` |
| `success` | `background-color: #13a10e; color: #fff; padding: 2px; border-radius: 3px` |
| `focus`   | `background-color: #881798; color: #fff; padding: 2px; border-radius: 3px` |
| `alert`   | `background-color: #ffa500; color: #fff; padding: 2px; border-radius: 3px` |
| `danger`  | `background-color: #dc143c; color: #fff; padding: 2px; border-radius: 3px` |

### Alias por defecto

`d` → `debug`, `l` → `log`, `i` → `info`, `w` → `warn`, `e` → `error`

## Cómo usar

### Crear una instancia

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

#### Función `createDebug`

Crea un proxy con alias y soporte para niveles personalizados.

```typescript
<T extends typeof DebugWeb>(options?: CreateDebugOptions, DebugClass?: T) => CustomLogLevels & InstanceType<T>;
```

#### Métodos de registro

| Nivel        | Tipo                                                                   |
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

#### Manejo de datos

| Método | Tipo                                              | Comentario                                                                  |
|--------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `set`  | `(data: DebugWebData) => void`                    | Guarda los datos de depuración (los fusiona)                                |
| `get`  | `(api?: boolean) => DebugWebData  \| undefined`   | Devuelve una copia de todos los datos. Si es `true`, añade métodos de ayuda |
| `dump` | `(keys: string[], options?: DumpOptions) => void` | Imprime los datos en formato tabla (ignora niveles de registro)             |

```typescript
type DebugWebData = Record<string, unknown>

type DumpOptions = {
  level?: DebugLogLevel;
  title?: string | ((data: DebugWebData) => string);
  open?: boolean;
}
```

#### Gestión de niveles

| Método           | Tipo            | Comentario                             |
|------------------|-----------------|----------------------------------------|
| `level` (getter) | `DebugLogLevel` | Obtener el nivel de registro actual    |
| `level` (setter) | `DebugLogLevel` | Establecer el nivel de registro actual |

#### Estilización

| Método           | Tipo                              | Comentario                                   |
|------------------|-----------------------------------|----------------------------------------------|
| `style` (getter) | `() => DebugWebStyle`             | Obtener el mapa de estilos actual            |
| `style` (setter) | `(styles: DebugWebStyle) => void` | Actualizar el mapa de estilos (se fusionará) |

```typescript
type DebugWebStyle = Record<DebugLogLevel, string | undefined>
```

### Datos de depuración

Guarde cualquier dato y véalo en la consola:

```javascript
debug.set({ error: null, user: { id: 1, name: 'John' } });
```

Los datos son accesibles a través de `window[prop]` (por defecto es `debug`).
Escriba en la consola del navegador:

```javascript
debug // { error: null, user: {...}, setLevel: f }
debug.setLevel() // cambiar el nivel de registro
```

## Soporte

Si esta biblioteca te resulta útil, considera apoyar su desarrollo:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Licencia

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Enlaces

- [📝 Historial de cambios](CHANGELOG.md)
- [💻 Código fuente](https://github.com/Karlen-ll/debug-web)
- [🐛 Reportes de errores](https://github.com/Karlen-ll/debug-web/issues)
- [📦 Paquete NPM](https://www.npmjs.com/package/debug-web)
