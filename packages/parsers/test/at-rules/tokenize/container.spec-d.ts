import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@container - Basic Queries', () => {
  it('should tokenize simple container query', () => {
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

  it('should tokenize container query with max-width', () => {
    const input = '@container (max-width: 800px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'max-width'; content: 'max-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '800px'; content: '800px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@container - Named Containers', () => {
  it('should tokenize named container query', () => {
    const input = '@container sidebar(min-width: 300px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'function'; name: 'sidebar'; argument: 'min-width: 300px'; content: 'sidebar(min-width: 300px)' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@container - Comparison Operators', () => {
  it('should tokenize with >= operator', () => {
    const input = '@container (width >= 400px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '>='; content: '>=' },
      { type: 'value'; value: '400px'; content: '400px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with <= operator', () => {
    const input = '@container (width <= 800px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '<='; content: '<=' },
      { type: 'value'; value: '800px'; content: '800px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with > operator', () => {
    const input = '@container (width > 400px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '>'; content: '>' },
      { type: 'value'; value: '400px'; content: '400px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with < operator', () => {
    const input = '@container (width < 800px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '<'; content: '<' },
      { type: 'value'; value: '800px'; content: '800px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with = operator', () => {
    const input = '@container (width = 600px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '='; content: '=' },
      { type: 'value'; value: '600px'; content: '600px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@container - Logical Operators', () => {
  it('should tokenize with and operator', () => {
    const input = '@container (min-width: 400px) and (max-width: 800px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'min-width'; content: 'min-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '400px'; content: '400px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'max-width'; content: 'max-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '800px'; content: '800px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with or operator', () => {
    const input = '@container (width < 400px) or (width > 800px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '<'; content: '<' },
      { type: 'value'; value: '400px'; content: '400px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
      { type: 'operator'; operator: 'or'; content: 'or' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'width'; content: 'width' },
      { type: 'operator'; operator: '>'; content: '>' },
      { type: 'value'; value: '800px'; content: '800px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize with not operator', () => {
    const input = '@container not (min-width: 400px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'container'; content: '@container' },
      { type: 'operator'; operator: 'not'; content: 'not' },
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
