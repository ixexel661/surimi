import { describe, expectTypeOf, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@import - Basic Imports', () => {
  it('should tokenize url with double quotes', () => {
    const input = '@import "styles.css"';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"styles.css"'; content: '"styles.css"' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize url with single quotes', () => {
    const input = "@import 'theme.css'";

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: "'theme.css'"; content: "'theme.css'" },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize url function', () => {
    const input = '@import url(base.css)';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'url'; value: 'base.css'; content: 'url(base.css)' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize url function with quotes', () => {
    const input = '@import url("components.css")';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'url'; value: '"components.css"'; content: 'url("components.css")' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@import - With Media Queries', () => {
  it('should tokenize import with media query', () => {
    const input = '@import "print.css" print';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"print.css"'; content: '"print.css"' },
      { type: 'identifier'; value: 'print'; content: 'print' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize import with complex media query', () => {
    const input = '@import "mobile.css" screen and (max-width: 768px)';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"mobile.css"'; content: '"mobile.css"' },
      { type: 'identifier'; value: 'screen'; content: 'screen' },
      { type: 'operator'; operator: 'and'; content: 'and' },
      { type: 'delimiter'; delimiter: '('; content: '(' },
      { type: 'identifier'; value: 'max-width'; content: 'max-width' },
      { type: 'delimiter'; delimiter: ':'; content: ':' },
      { type: 'value'; value: '768px'; content: '768px' },
      { type: 'delimiter'; delimiter: ')'; content: ')' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@import - With Supports', () => {
  it('should tokenize import with supports condition', () => {
    const input = '@import "grid.css" supports(display: grid)';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"grid.css"'; content: '"grid.css"' },
      { type: 'function'; name: 'supports'; argument: 'display: grid'; content: 'supports(display: grid)' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});

describe('@import - With Layer', () => {
  it('should tokenize import with layer', () => {
    const input = '@import "theme.css" layer(theme)';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"theme.css"'; content: '"theme.css"' },
      { type: 'function'; name: 'layer'; argument: 'theme'; content: 'layer(theme)' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });

  it('should tokenize import with anonymous layer', () => {
    const input = '@import "utilities.css" layer';

    type Expected = [
      { type: 'at-rule-name'; name: 'import'; content: '@import' },
      { type: 'string'; value: '"utilities.css"'; content: '"utilities.css"' },
      { type: 'identifier'; value: 'layer'; content: 'layer' },
    ];

    const tokens = tokenizeAtRule(input);
    expectTypeOf(tokens).toEqualTypeOf<Expected>();
  });
});
