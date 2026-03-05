import { vi } from 'vitest';
import { CONSOLE_METHODS } from './const';

CONSOLE_METHODS.forEach(method => {
  vi.spyOn(console, method).mockImplementation(() => {});
});
