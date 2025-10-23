import { describe, expect, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@font-face - Basic', () => {
  it('should tokenize simple @font-face', () => {
    const input = '@font-face';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([{ type: 'at-rule-name', name: 'font-face', content: '@font-face' }]);
  });
});
