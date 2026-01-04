import { DebugWeb, type DebugWebData, type DebugWebLogLevel, type DebugWebOptions } from './debugWeb';

export const log = DebugWeb.log;
export const info = DebugWeb.info;
export const success = DebugWeb.success;
export const warn = DebugWeb.warn;
export const error = DebugWeb.error;
export const debug = DebugWeb.debug;
export const group = DebugWeb.group;
export const groupEnd = DebugWeb.groupEnd;
export const dir = DebugWeb.dir;
export const dirxml = DebugWeb.dirxml;
export const table = DebugWeb.table;
export const count = DebugWeb.count;
export const countReset = DebugWeb.countReset;
export const time = DebugWeb.time;
export const timeLog = DebugWeb.timeLog;
export const timeEnd = DebugWeb.timeEnd;
export const trace = DebugWeb.trace;

export const debugData = DebugWeb.set;
export const debugInit = DebugWeb.init;
export const debugReset = DebugWeb.reset;

export const debugGetStyle = DebugWeb.getStyle;
export const debugSetStyle = DebugWeb.setStyle;

export type { DebugWebData, DebugWebLogLevel, DebugWebOptions };
export { DebugWeb };
