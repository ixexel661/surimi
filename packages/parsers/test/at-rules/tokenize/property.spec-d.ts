import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@property - Custom Property Names', () => {
  it('should tokenize simple custom property', () => {
    const input = '@property --my-color';

    type Expected = [
      { type: 'at-rule-name'; name: 'property'; content: '@property' },
      { type: 'identifier'; value: '--my-color'; content: '--my-color' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize custom property with numbers', () => {
    const input = '@property --size-1';

    type Expected = [
      { type: 'at-rule-name'; name: 'property'; content: '@property' },
      { type: 'identifier'; value: '--size-1'; content: '--size-1' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize custom property with multiple hyphens', () => {
    const input = '@property --primary-button-bg-color';

    type Expected = [
      { type: 'at-rule-name'; name: 'property'; content: '@property' },
      { type: 'identifier'; value: '--primary-button-bg-color'; content: '--primary-button-bg-color' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize custom property with underscores', () => {
    const input = '@property --my_custom_var';

    type Expected = [
      { type: 'at-rule-name'; name: 'property'; content: '@property' },
      { type: 'identifier'; value: '--my_custom_var'; content: '--my_custom_var' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize custom property with camelCase', () => {
    const input = '@property --myCustomProperty';

    type Expected = [
      { type: 'at-rule-name'; name: 'property'; content: '@property' },
      { type: 'identifier'; value: '--myCustomProperty'; content: '--myCustomProperty' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
