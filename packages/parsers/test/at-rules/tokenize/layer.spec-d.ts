import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@layer - Single Layer', () => {
  it('should tokenize simple layer name', () => {
    const input = '@layer utilities';

    type Expected = [
      { type: 'at-rule-name'; name: 'layer'; content: '@layer' },
      { type: 'identifier'; value: 'utilities'; content: 'utilities' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize layer with hyphenated name', () => {
    const input = '@layer base-styles';

    type Expected = [
      { type: 'at-rule-name'; name: 'layer'; content: '@layer' },
      { type: 'identifier'; value: 'base-styles'; content: 'base-styles' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@layer - Nested Layers', () => {
  it('should tokenize nested layer with dot notation', () => {
    const input = '@layer framework.components';

    type Expected = [
      { type: 'at-rule-name'; name: 'layer'; content: '@layer' },
      { type: 'identifier'; value: 'framework'; content: 'framework' },
      { type: 'identifier'; value: 'components'; content: 'components' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize deeply nested layer', () => {
    const input = '@layer theme.layout.grid';

    type Expected = [
      { type: 'at-rule-name'; name: 'layer'; content: '@layer' },
      { type: 'identifier'; value: 'theme'; content: 'theme' },
      { type: 'identifier'; value: 'layout'; content: 'layout' },
      { type: 'identifier'; value: 'grid'; content: 'grid' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@layer - Multiple Layers', () => {
  it('should tokenize multiple layer names with comma', () => {
    const input = '@layer reset, base, theme';

    type Expected = [
      { type: 'at-rule-name'; name: 'layer'; content: '@layer' },
      { type: 'identifier'; value: 'reset'; content: 'reset' },
      { type: 'delimiter'; delimiter: ','; content: ',' },
      { type: 'identifier'; value: 'base'; content: 'base' },
      { type: 'delimiter'; delimiter: ','; content: ',' },
      { type: 'identifier'; value: 'theme'; content: 'theme' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@layer - Anonymous Layer', () => {
  it('should tokenize anonymous layer', () => {
    const input = '@layer';

    type Expected = [{ type: 'at-rule-name'; name: 'layer'; content: '@layer' }];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
