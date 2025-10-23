import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@font-face - Basic', () => {
  it('should tokenize simple @font-face', () => {
    const input = '@font-face';

    type Expected = [{ type: 'at-rule-name'; name: 'font-face'; content: '@font-face' }];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
