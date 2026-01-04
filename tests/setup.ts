import { vi, afterEach } from 'vitest';

const consoleMethods = [
  'debug', 'log', 'info', 'warn', 'error', 'dir', 'dirxml', 'count', 'countReset', 'table',
  'group', 'groupCollapsed', 'groupEnd', 'time', 'timeLog', 'timeEnd', 'trace'
] as const;

consoleMethods.forEach(method => {
  vi.spyOn(console, method).mockImplementation(() => {});
});

afterEach(() => {
  consoleMethods.forEach(method => {
    vi.mocked(console[method]).mockClear();
  });

  vi.clearAllMocks();
});
