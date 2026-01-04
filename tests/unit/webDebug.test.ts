import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { getWindowKey } from '@/utils';
import { DebugWeb } from '@/debugWeb';
import {
  TEST_MESSAGE,
  STYLES_OBJECT,
  STYLES_STRING,
  DATA_FRAGMENT_1,
  DATA_FRAGMENT_2,
  COMPLETE_DATA,
  TEST_APP_NAME,
  TEST_PROP_NAME,
  DEFAULT_APP_NAME,
  DEFAULT_PROP_NAME,
} from '../const';
import { defaultStyle } from '@/stylize';

describe('WebDebug', () => {
  beforeEach(() => {
    DebugWeb.reset();

    if (typeof window !== 'undefined') {
      delete window[getWindowKey(DEFAULT_APP_NAME, true)];
      delete window[getWindowKey(TEST_APP_NAME, true)];

      delete window[DEFAULT_PROP_NAME];
      delete window[TEST_PROP_NAME];
    }
  });

  describe('logging', () => {
    describe('log levels', () => {
      const methods = [
        { method: 'log', consoleMethod: 'log' as const },
        { method: 'info', consoleMethod: 'info' as const },
        { method: 'success', consoleMethod: 'info' as const },
        { method: 'warn', consoleMethod: 'warn' as const },
      ] as const;

      it.each(methods)('$method calls corresponding console method', ({ method, consoleMethod }) => {
        DebugWeb.init({ level: 'log' });
        DebugWeb[method](TEST_MESSAGE);

        expect(console[consoleMethod]).toHaveBeenCalled();
      });

      it.each(methods)('$method is not called when level is error', ({ method, consoleMethod }) => {
        DebugWeb.init({ level: 'error' });
        DebugWeb[method](TEST_MESSAGE);

        expect(console[consoleMethod]).not.toHaveBeenCalled();
      });
    });

    describe('error()', () => {
      it('handles Error object with stack trace', () => {
        DebugWeb.init({ level: 'error' });
        DebugWeb.error(new Error(TEST_MESSAGE));

        expect(console.error).toHaveBeenCalled();
      });

      it('handles string as error message', () => {
        DebugWeb.init({ level: 'error' });
        DebugWeb.error(TEST_MESSAGE);

        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('groups', () => {
    beforeEach(() => {
      DebugWeb.init();
    });

    it('creates a regular console group', () => {
      DebugWeb.group();
      expect(console.group).toHaveBeenCalled();
    });

    it('creates a collapsed console group', () => {
      DebugWeb.group(true);
      expect(console.groupCollapsed).toHaveBeenCalled();
    });

    it('closes the current console group', () => {
      DebugWeb.groupEnd();
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });

  describe('helper methods', () => {
    beforeEach(() => {
      DebugWeb.init({ level: 'debug' });
    });

    it('debug() outputs debug-level message', () => {
      DebugWeb.debug(TEST_MESSAGE);
      expect(console.debug).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('dir() displays object properties interactively', () => {
      DebugWeb.dir(DATA_FRAGMENT_1);
      expect(console.dir).toHaveBeenCalledWith(DATA_FRAGMENT_1, undefined);
    });

    it('dirxml() displays XML/HTML element tree', () => {
      DebugWeb.dirxml(DATA_FRAGMENT_2);
      expect(console.dirxml).toHaveBeenCalledWith(DATA_FRAGMENT_2);
    });

    it('count() logs invocation count with label', () => {
      DebugWeb.count(TEST_MESSAGE);
      expect(console.count).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('countReset() resets counter for given label', () => {
      DebugWeb.countReset(TEST_MESSAGE);
      expect(console.countReset).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('table() displays data as a table', () => {
      DebugWeb.table([TEST_MESSAGE]);
      expect(console.table).toHaveBeenCalledWith([TEST_MESSAGE], undefined);
    });

    it('time() starts timer with label', () => {
      DebugWeb.time(TEST_MESSAGE);
      expect(console.time).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('timeLog() outputs current timer value', () => {
      DebugWeb.timeLog(TEST_MESSAGE);
      expect(console.timeLog).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('timeEnd() stops timer and outputs result', () => {
      DebugWeb.timeEnd(TEST_MESSAGE);
      expect(console.timeEnd).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('trace() outputs stack trace with message', () => {
      DebugWeb.trace(TEST_MESSAGE);
      expect(console.trace).toHaveBeenCalledWith(TEST_MESSAGE);
    });
  });

  describe('storage', () => {
    it('uses default app name for data storage', () => {
      DebugWeb.init({ data: DATA_FRAGMENT_1 });

      expect(window[getWindowKey(DEFAULT_APP_NAME, true)]).toEqual(DATA_FRAGMENT_1);
    });

    it('uses custom app name for data storage', () => {
      DebugWeb.init({ data: DATA_FRAGMENT_1, app: TEST_APP_NAME });

      expect(window[getWindowKey(TEST_APP_NAME, true)]).toEqual(DATA_FRAGMENT_1);
    });
  });

  describe('getter', () => {
    it('creates default property in window object', () => {
      DebugWeb.init({ data: DATA_FRAGMENT_1 });

      expect(window[DEFAULT_PROP_NAME]).toEqual(DATA_FRAGMENT_1);
    });

    it('creates custom property in window object', () => {
      DebugWeb.init({ prop: TEST_PROP_NAME, data: DATA_FRAGMENT_1 });

      expect(window[TEST_PROP_NAME]).toEqual(DATA_FRAGMENT_1);
    });

    it('does not create property when prop=null', () => {
      DebugWeb.init({ prop: null });
      expect(DEFAULT_PROP_NAME in window).toBe(false);
    });
  });

  describe('merge', () => {
    it('merges data from init and subsequent set calls', () => {
      DebugWeb.init({ data: DATA_FRAGMENT_1 });
      DebugWeb.set(DATA_FRAGMENT_2);
      expect(DebugWeb.get()).toEqual(COMPLETE_DATA);
    });

    it('merges data from multiple set calls', () => {
      DebugWeb.init();
      DebugWeb.set(DATA_FRAGMENT_1);
      DebugWeb.set(DATA_FRAGMENT_2);
      expect(DebugWeb.get()).toEqual(COMPLETE_DATA);
    });
  });

  describe('styles', () => {
    it('updates styles for a single log level', () => {
      DebugWeb.init();
      DebugWeb.setStyle('error', STYLES_STRING);

      expect(DebugWeb.getStyle()).toEqual({ ...defaultStyle, error: STYLES_STRING });
    });

    it('replaces all styles completely with new styles object', () => {
      DebugWeb.init();
      DebugWeb.setStyle(STYLES_OBJECT);

      expect(DebugWeb.getStyle()).toEqual(STYLES_OBJECT);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      vi.stubGlobal('window', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('handles window undefined gracefully during init', () => {
      expect(() => DebugWeb.init()).not.toThrow();
      expect(DebugWeb.get()).toBeUndefined();
    });
  });
});
