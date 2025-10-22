import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@supports - Property Checks', () => {
  it('should tokenize simple property check', () => {
    const input = '@supports (display: grid)';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize property with value', () => {
    const input = '@supports (transform: rotate(45deg))';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'transform'; content: 'transform' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'function'; name: 'rotate'; argument: '45deg'; content: 'rotate(45deg)' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize custom property check', () => {
    const input = '@supports (--custom: value)';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: '--custom'; content: '--custom' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'value'; content: 'value' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@supports - Selector Function', () => {
  it('should tokenize selector function with simple selector', () => {
    const input = '@supports selector(:has(a))';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'function'; name: 'selector'; argument: ':has(a)'; content: 'selector(:has(a))' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize selector function with complex selector', () => {
    const input = '@supports selector(:is(a, b))';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'function'; name: 'selector'; argument: ':is(a, b)'; content: 'selector(:is(a, b))' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@supports - Logical Operators', () => {
  it('should tokenize with and operator', () => {
    const input = '@supports (display: grid) and (gap: 1rem)';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'gap'; content: 'gap' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '1rem'; content: '1rem' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with or operator', () => {
    const input = '@supports (display: flex) or (display: grid)';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'flex'; content: 'flex' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'or'; content: 'or' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with not operator', () => {
    const input = '@supports not (display: grid)';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'operator'; operator: 'not'; content: 'not' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@supports - Complex Queries', () => {
  it('should tokenize complex nested conditions', () => {
    const input = '@supports (display: grid) and ((gap: 1rem) or (grid-gap: 1rem))';

    type Expected = [
      { type: 'at-rule-name'; name: 'supports'; content: '@supports' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'display'; content: 'display' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'gap'; content: 'gap' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '1rem'; content: '1rem' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'or'; content: 'or' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'grid-gap'; content: 'grid-gap' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '1rem'; content: '1rem' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
