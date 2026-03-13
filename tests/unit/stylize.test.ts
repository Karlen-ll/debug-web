import { describe, it, expect } from 'vitest';
import { stylizeMsg, stylizeAttrs } from '@/stylize';
import { TEST_MESSAGE, TEST_STR_STYLE, DATA_FRAGMENT_1 } from '../const';

describe('stylizeMessage', () => {
  it('prepends %c to message', () => {
    expect(stylizeMsg(TEST_MESSAGE, TEST_STR_STYLE)[0]).toMatch(/^%c/);
  });

  it('preserves style as second array element', () => {
    expect(stylizeMsg(TEST_MESSAGE, TEST_STR_STYLE)[1]).toBe(TEST_STR_STYLE);
  });

  describe('background style detection', () => {
    ;[
      { style: TEST_STR_STYLE, shouldHaveSpaces: false },
      { style: 'background:yellow', shouldHaveSpaces: true },
      { style: `${TEST_STR_STYLE}; background-color:#000`, shouldHaveSpaces: true },
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
      expect(stylizeAttrs([TEST_MESSAGE, DATA_FRAGMENT_1], TEST_STR_STYLE)).toEqual([`%c${TEST_MESSAGE}`, TEST_STR_STYLE, DATA_FRAGMENT_1]);
    })

    ;[
      { attrs: [], expected: [] },
      { attrs: [TEST_MESSAGE], expected: [`%c${TEST_MESSAGE}`, TEST_STR_STYLE] },
    ].forEach(({ attrs, expected }) => {
      it(`handles ${attrs.length} attribute(s)`, () => {
        expect(stylizeAttrs(attrs, TEST_STR_STYLE)).toEqual(expected);
      });
    });
  });
});
