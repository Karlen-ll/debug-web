import { describe, it, expect } from 'vitest';
import { stylizeMsg, stylizeAttrs } from '@/stylize';
import { TEST_MESSAGE, STYLES_STRING, DATA_FRAGMENT_1 } from '../const';

describe('stylizeMessage', () => {
  it('prepends %c to message', () => {
    expect(stylizeMsg(TEST_MESSAGE, STYLES_STRING)[0]).toMatch(/^%c/);
  });

  it('preserves style as second array element', () => {
    expect(stylizeMsg(TEST_MESSAGE, STYLES_STRING)[1]).toBe(STYLES_STRING);
  });

  describe('background style detection', () => {
    ;[
      { style: STYLES_STRING, shouldHaveSpaces: false },
      { style: 'background:yellow', shouldHaveSpaces: true },
      { style: `${STYLES_STRING}; background-color:#000`, shouldHaveSpaces: true },
    ].forEach(({ style, shouldHaveSpaces }) => {
      it(`${shouldHaveSpaces ? 'adds' : 'does not add'} spaces for "${style}"`, () => {
        const expected = shouldHaveSpaces ? `%c ${TEST_MESSAGE} ` : `%c${TEST_MESSAGE}`;
        expect(stylizeMsg(TEST_MESSAGE, style)[0]).toBe(expected);
      });
    });
  });
});

describe('stylizeAttrs', () => {
  describe('when styles is NOT provided', () => {
    ;[null, undefined].forEach(styles => {
      it(`returns original array for styles=${styles}`, () => {
        expect(stylizeAttrs([TEST_MESSAGE, DATA_FRAGMENT_1], styles)).toEqual([TEST_MESSAGE, DATA_FRAGMENT_1]);
      });
    });
  });

  describe('when styles is provided', () => {
    it('applies stylizeMessage to first element', () => {
      expect(stylizeAttrs([TEST_MESSAGE, DATA_FRAGMENT_1], STYLES_STRING)).toEqual([`%c${TEST_MESSAGE}`, STYLES_STRING, DATA_FRAGMENT_1]);
    })

    ;[
      { attrs: [], expected: [] },
      { attrs: [TEST_MESSAGE], expected: [`%c${TEST_MESSAGE}`, STYLES_STRING] },
    ].forEach(({ attrs, expected }) => {
      it(`handles ${attrs.length} attribute(s)`, () => {
        expect(stylizeAttrs(attrs, STYLES_STRING)).toEqual(expected);
      });
    });
  });
});
