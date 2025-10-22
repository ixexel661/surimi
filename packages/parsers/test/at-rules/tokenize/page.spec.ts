import { describe, expect, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@page - Basic', () => {
  it('should tokenize simple @page', () => {
    const input = '@page';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([{ type: 'at-rule-name', name: 'page', content: '@page' }]);
  });

  it('should tokenize @page with pseudo-class', () => {
    const input = '@page :first';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'page', content: '@page' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'first', content: 'first' },
    ]);
  });

  it('should tokenize @page with :left pseudo-class', () => {
    const input = '@page :left';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'page', content: '@page' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'left', content: 'left' },
    ]);
  });

  it('should tokenize @page with :right pseudo-class', () => {
    const input = '@page :right';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'page', content: '@page' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'right', content: 'right' },
    ]);
  });

  it('should tokenize @page with named page', () => {
    const input = '@page chapter';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'page', content: '@page' },
      { type: 'identifier', value: 'chapter', content: 'chapter' },
    ]);
  });

  it('should tokenize @page with named page and pseudo-class', () => {
    const input = '@page chapter :first';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'page', content: '@page' },
      { type: 'identifier', value: 'chapter', content: 'chapter' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'identifier', value: 'first', content: 'first' },
    ]);
  });
});
