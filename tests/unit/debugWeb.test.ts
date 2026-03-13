import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { TestDebugWeb } from '../utils';
import { createDebug } from '@/createDebug';
import {
  TEST_STYLES,
  TEST_MESSAGE,
  COMPLETE_DATA,
  DATA_FRAGMENT_1,
  DATA_FRAGMENT_2,
  DEFAULT_APP_NAME,
  DEFAULT_PROP_NAME,
  TEST_RAW_APP_NAME,
  TEST_APP_NAME,
  TEST_PROP_NAME,
} from '../const';
import { DEFAULT_STYLE } from '@/const';
import type { DebugWebOptions } from '@/types';

describe('DebugWeb', () => {
  const debug = createDebug(undefined, TestDebugWeb);
  const reset = (options?: DebugWebOptions) => {
    vi.clearAllMocks();
    debug.reset(options);
  };

  describe('core methods', () => {
    const methods = [
      { level: 'log', method: 'log' as const },
      { level: 'info', method: 'info' as const },
      { level: 'warn', method: 'warn' as const },
    ] as const;

    describe('log levels when enabled', () => {
      beforeEach(() => {
        reset();
      });

      it.each(methods)('$method calls corresponding console method', ({ level, method }) => {
        debug[level](TEST_MESSAGE);
        expect(console[method]).toHaveBeenCalled();
      });
    });

    describe('log levels when disabled', () => {
      beforeEach(() => {
        reset({ level: 'error', data: COMPLETE_DATA });
      });

      it.each(methods)('$method is not called when level is error', ({ level, method }) => {
        debug[level](TEST_MESSAGE);
        expect(console[method]).not.toHaveBeenCalled();
      });

      it('displays data table in console (ignores log level)', () => {
        debug.dump(['version'], { title: 'Test', level: 'info' });
        expect(console.table).toHaveBeenCalled();
      });
    });

    describe('error', () => {
      beforeEach(() => {
        reset();
      });

      it('handles Error object with stack trace', () => {
        debug.error(new Error(TEST_MESSAGE));
        expect(console.error).toHaveBeenCalled();
      });

      it('handles string as error message', () => {
        debug.error(TEST_MESSAGE);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('groups', () => {
    beforeEach(() => {
      reset();
    });

    it('creates a regular console group', () => {
      debug.group(true, 'log', TEST_MESSAGE);
      expect(console.group).toHaveBeenCalled();
    });

    it('creates a collapsed console group', () => {
      debug.group(false, 'log', TEST_MESSAGE);
      expect(console.groupCollapsed).toHaveBeenCalled();
    });

    it('closes the current console group', () => {
      debug.groupEnd();
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });

  describe('other methods', () => {
    beforeEach(() => {
      reset({ level: 'debug', native: true });
    });

    it('debug() outputs debug-level message', () => {
      debug.debug(TEST_MESSAGE);
      expect(console.debug).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('dir() displays object properties interactively', () => {
      debug.dir(DATA_FRAGMENT_1);
      expect(console.dir).toHaveBeenCalledWith(DATA_FRAGMENT_1, undefined);
    });

    it('dirxml() displays XML/HTML element tree', () => {
      debug.dirxml(DATA_FRAGMENT_2);
      expect(console.dirxml).toHaveBeenCalledWith(DATA_FRAGMENT_2);
    });

    it('count() logs invocation count with label', () => {
      debug.count(TEST_MESSAGE);
      expect(console.count).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('countReset() resets counter for given label', () => {
      debug.countReset(TEST_MESSAGE);
      expect(console.countReset).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('table() displays data as a table', () => {
      debug.table([TEST_MESSAGE]);
      expect(console.table).toHaveBeenCalledWith([TEST_MESSAGE], undefined);
    });

    it('time() starts timer with label', () => {
      debug.time(TEST_MESSAGE);
      expect(console.time).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('timeLog() outputs current timer value', () => {
      debug.timeLog(TEST_MESSAGE);
      expect(console.timeLog).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('timeEnd() stops timer and outputs result', () => {
      debug.timeEnd(TEST_MESSAGE);
      expect(console.timeEnd).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it('trace() outputs stack trace with message', () => {
      debug.trace(TEST_MESSAGE);
      expect(console.trace).toHaveBeenCalledWith(TEST_MESSAGE);
    });
  });

  describe('custom method', () => {
    beforeEach(() => {
      reset();
    });

    it('logs with custom level', () => {
      reset();
      debug.call('log', [TEST_MESSAGE], 'success');
      expect(console.log).toHaveBeenCalled();
    });

    it('dynamic methods', () => {
      debug.success?.(TEST_MESSAGE);
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('storage', () => {
    it('uses default app name for data storage', () => {
      reset({ data: DATA_FRAGMENT_1 });
      expect(window[DEFAULT_APP_NAME]).toEqual(DATA_FRAGMENT_1);
    });

    it('uses custom app name for data storage', () => {
      reset({ data: DATA_FRAGMENT_1, app: TEST_RAW_APP_NAME });
      expect(window[TEST_APP_NAME]).toEqual(DATA_FRAGMENT_1);
    });
  });

  describe('getter', () => {
    it('does not create property when prop=null', () => {
      reset({ prop: null });
      expect(DEFAULT_PROP_NAME in window).toBe(false);
    });

    it('creates default property in window object', () => {
      reset({ data: DATA_FRAGMENT_1 });
      expect(window[DEFAULT_PROP_NAME]).toMatchObject(DATA_FRAGMENT_1);
    });

    it('creates custom property in window object', () => {
      reset({ prop: TEST_PROP_NAME, data: DATA_FRAGMENT_1 });
      expect(window[TEST_PROP_NAME]).toMatchObject(DATA_FRAGMENT_1);
    });
  });

  describe('merge', () => {
    it('merges data from init and subsequent set calls', () => {
      reset({ data: DATA_FRAGMENT_1 });

      debug.set(DATA_FRAGMENT_2);
      expect(debug.get()).toMatchObject(COMPLETE_DATA);
    });

    it('merges data from multiple set calls', () => {
      reset();

      debug.set(DATA_FRAGMENT_1);
      debug.set(DATA_FRAGMENT_2);
      expect(debug.get()).toMatchObject(COMPLETE_DATA);
    });
  });

  describe('styles', () => {
    it('updates styles', () => {
      reset();
      debug.style = TEST_STYLES;
      expect(debug.style).toEqual({ ...DEFAULT_STYLE, ...TEST_STYLES });
    });
  });

  describe('level', () => {
    it('updates log level', () => {
      reset({ level: 'error' });
      debug.level = 'log';
      expect(debug.level).toEqual('log');
    });

    it('saves level to storage', () => {
      reset({ level: 'log' });
      debug.level ='error';
      expect(debug.level).toEqual('error');
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
      expect(() => new TestDebugWeb()).not.toThrow();
    });
  });
});
