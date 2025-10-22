import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@media - Basic Media Types', () => {
  it('should tokenize screen media type', () => {
    const input = '@media screen';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize print media type', () => {
    const input = '@media print';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'print'; content: 'print' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize all media type', () => {
    const input = '@media all';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'all'; content: 'all' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@media - Logical Operators', () => {
  it('should tokenize with and operator', () => {
    const input = '@media screen and (color)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'color'; content: 'color' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with or operator', () => {
    const input = '@media screen or print';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
      { type: 'operator'; operator: 'or'; content: 'or' },
      { type: 'identifier'; value: 'print'; content: 'print' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with not operator', () => {
    const input = '@media not print';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'operator'; operator: 'not'; content: 'not' },
      { type: 'identifier'; value: 'print'; content: 'print' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@media - Media Features', () => {
  it('should tokenize min-width feature', () => {
    const input = '@media (min-width: 768px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'min-width'; content: 'min-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '768px'; content: '768px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize max-width feature', () => {
    const input = '@media (max-width: 1200px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'max-width'; content: 'max-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '1200px'; content: '1200px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize orientation feature', () => {
    const input = '@media (orientation: landscape)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'orientation'; content: 'orientation' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'landscape'; content: 'landscape' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize aspect-ratio feature', () => {
    const input = '@media (aspect-ratio: 16/9)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'aspect-ratio'; content: 'aspect-ratio' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '16'; content: '16' },
      { type: 'delimiter'; delimiter: '/'; content: '/' },
      { type: 'value'; value: '9'; content: '9' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@media - Complex Queries', () => {
  it('should tokenize complex query with multiple conditions', () => {
    const input = '@media screen and (min-width: 768px) and (max-width: 1200px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'min-width'; content: 'min-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '768px'; content: '768px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'max-width'; content: 'max-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '1200px'; content: '1200px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize query with parentheses and feature name only', () => {
    const input = '@media (hover)';

    type Expected = [
      { type: 'at-rule-name'; name: 'media'; content: '@media' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'hover'; content: 'hover' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
