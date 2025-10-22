import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@page - Basic', () => {
  it('should tokenize simple @page', () => {
    const input = '@page';

    type Expected = [{ type: 'at-rule-name'; name: 'page'; content: '@page' }];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize @page with pseudo-class', () => {
    const input = '@page :first';

    type Expected = [
      { type: 'at-rule-name'; name: 'page'; content: '@page' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'first'; content: 'first' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize @page with :left pseudo-class', () => {
    const input = '@page :left';

    type Expected = [
      { type: 'at-rule-name'; name: 'page'; content: '@page' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'left'; content: 'left' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize @page with :right pseudo-class', () => {
    const input = '@page :right';

    type Expected = [
      { type: 'at-rule-name'; name: 'page'; content: '@page' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'right'; content: 'right' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize @page with named page', () => {
    const input = '@page chapter';

    type Expected = [
      { type: 'at-rule-name'; name: 'page'; content: '@page' },
      { type: 'identifier'; value: 'chapter'; content: 'chapter' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize @page with named page and pseudo-class', () => {
    const input = '@page chapter :first';

    type Expected = [
      { type: 'at-rule-name'; name: 'page'; content: '@page' },
      { type: 'identifier'; value: 'chapter'; content: 'chapter' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'identifier'; value: 'first'; content: 'first' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
