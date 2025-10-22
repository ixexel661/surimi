import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@keyframes - Basic Animation Names', () => {
  it('should tokenize simple animation name', () => {
    const input = '@keyframes slide';

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'identifier'; value: 'slide'; content: 'slide' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize hyphenated animation name', () => {
    const input = '@keyframes slide-in';

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'identifier'; value: 'slide-in'; content: 'slide-in' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize camelCase animation name', () => {
    const input = '@keyframes slideInFromLeft';

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'identifier'; value: 'slideInFromLeft'; content: 'slideInFromLeft' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@keyframes - Quoted Animation Names', () => {
  it('should tokenize double-quoted animation name', () => {
    const input = '@keyframes "my-animation"';

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'string'; value: '"my-animation"'; content: '"my-animation"' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize single-quoted animation name', () => {
    const input = "@keyframes 'my-animation'";

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'string'; value: "'my-animation'"; content: "'my-animation'" },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize quoted name with spaces', () => {
    const input = '@keyframes "slide in from left"';

    type Expected = [
      { type: 'at-rule-name'; name: 'keyframes'; content: '@keyframes' },
      { type: 'string'; value: '"slide in from left"'; content: '"slide in from left"' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@keyframes - Vendor Prefixes', () => {
  it('should tokenize -webkit-keyframes', () => {
    const input = '@-webkit-keyframes slide';

    type Expected = [
      { type: 'at-rule-name'; name: '-webkit-keyframes'; content: '@-webkit-keyframes' },
      { type: 'identifier'; value: 'slide'; content: 'slide' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize -moz-keyframes', () => {
    const input = '@-moz-keyframes fade';

    type Expected = [
      { type: 'at-rule-name'; name: '-moz-keyframes'; content: '@-moz-keyframes' },
      { type: 'identifier'; value: 'fade'; content: 'fade' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
