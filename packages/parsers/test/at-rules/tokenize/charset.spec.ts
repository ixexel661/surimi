import { describe, expect, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@charset - Encoding', () => {
  it('should tokenize UTF-8 charset', () => {
    const input = '@charset "UTF-8"';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'charset', content: '@charset' },
      { type: 'string', value: '"UTF-8"', content: '"UTF-8"' },
    ]);
  });

  it('should tokenize ISO charset', () => {
    const input = '@charset "iso-8859-1"';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'charset', content: '@charset' },
      { type: 'string', value: '"iso-8859-1"', content: '"iso-8859-1"' },
    ]);
  });
});
