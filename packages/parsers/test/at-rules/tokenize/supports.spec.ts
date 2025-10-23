import { describe, expect, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@supports - Property Checks', () => {
  it('should tokenize simple property check', () => {
    const input = '@supports (display: grid)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'grid', content: 'grid' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });

  it('should tokenize property with value', () => {
    const input = '@supports (transform: rotate(45deg))';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'transform', content: 'transform' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'function', name: 'rotate', argument: '45deg', content: 'rotate(45deg)' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });

  it('should tokenize custom property check', () => {
    const input = '@supports (--custom: value)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: '--custom', content: '--custom' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'value', content: 'value' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });
});

describe('@supports - Selector Function', () => {
  it('should tokenize selector function with simple selector', () => {
    const input = '@supports selector(:has(a))';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'function', name: 'selector', argument: ':has(a)', content: 'selector(:has(a))' },
    ]);
  });

  it('should tokenize selector function with complex selector', () => {
    const input = '@supports selector(:is(a, b))';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'function', name: 'selector', argument: ':is(a, b)', content: 'selector(:is(a, b))' },
    ]);
  });
});

describe('@supports - Logical Operators', () => {
  it('should tokenize with and operator', () => {
    const input = '@supports (display: grid) and (gap: 1rem)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'grid', content: 'grid' },
      { type: 'delimiter', delimiter: ')', content: ')' },
      { type: 'operator', operator: 'and', content: 'and' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'gap', content: 'gap' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'dimension', value: 1, unit: 'rem', content: '1rem' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });

  it('should tokenize with or operator', () => {
    const input = '@supports (display: flex) or (display: grid)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'flex', content: 'flex' },
      { type: 'delimiter', delimiter: ')', content: ')' },
      { type: 'operator', operator: 'or', content: 'or' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'grid', content: 'grid' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });

  it('should tokenize with not operator', () => {
    const input = '@supports not (display: grid)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'operator', operator: 'not', content: 'not' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'grid', content: 'grid' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });
});

describe('@supports - Complex Queries', () => {
  it('should tokenize complex nested conditions', () => {
    const input = '@supports (display: grid) and ((gap: 1rem) or (grid-gap: 1rem))';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'supports', content: '@supports' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'display', content: 'display' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'grid', content: 'grid' },
      { type: 'delimiter', delimiter: ')', content: ')' },
      { type: 'operator', operator: 'and', content: 'and' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'gap', content: 'gap' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'dimension', value: 1, unit: 'rem', content: '1rem' },
      { type: 'delimiter', delimiter: ')', content: ')' },
      { type: 'operator', operator: 'or', content: 'or' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'grid-gap', content: 'grid-gap' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'dimension', value: 1, unit: 'rem', content: '1rem' },
      { type: 'delimiter', delimiter: ')', content: ')' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });
});
