import { describe, expect, expectTypeOf, it } from 'vitest';

import { tokenize } from '#tokenize';

describe('attribute selectors', () => {
  it('tokenizes attribute selectors', () => {
    const input = 'div[class="container"][data-id^="item"]:hover';

    const expected = [
      { type: 'type', content: 'div', name: 'div' },
      { type: 'attribute', content: '[class="container"]', name: 'class', operator: '=', value: '"container"' },
      { type: 'attribute', content: '[data-id^="item"]', name: 'data-id', operator: '^=', value: '"item"' },
      { type: 'pseudo-class', content: ':hover', name: 'hover' },
    ];

    type Expected = [
      { type: 'type'; content: 'div'; name: 'div' },
      { type: 'attribute'; content: '[class="container"]'; name: 'class'; operator: '='; value: '"container"' },
      { type: 'attribute'; content: '[data-id^="item"]'; name: 'data-id'; operator: '^='; value: '"item"' },
      { type: 'pseudo-class'; content: ':hover'; name: 'hover' },
    ];

    const tokens = tokenize(input);
    expect(tokens).toEqual(expected);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
