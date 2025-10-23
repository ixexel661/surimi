import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@media Rules', () => {
  it('should tokenizeAtRule simple @media rule', () => {
    const input = '@media screen';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenizeAtRule @media with and operator', () => {
    const input = '@media screen and (min-width: 768px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'min-width'; content: 'min-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '768px'; content: '768px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@container Rules', () => {
  it('should tokenizeAtRule simple @container rule', () => {
    const input = '@container (min-width: 400px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'min-width'; content: 'min-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '400px'; content: '400px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('Token Types', () => {
  it('should parse value tokens (dimensions)', () => {
    const input = '@media (width: 768px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '768px'; content: '768px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should parse value tokens (percentages)', () => {
    const input = '@media (width: 50%)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '50%'; content: '50%' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
