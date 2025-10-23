import { describe, expect, it } from 'vitest';

import { tokenizeAtRule } from '#index';

describe('@import - Basic Imports', () => {
  it('should tokenize url with double quotes', () => {
    const input = '@import "styles.css"';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"styles.css"', content: '"styles.css"' },
    ]);
  });

  it('should tokenize url with single quotes', () => {
    const input = "@import 'theme.css'";

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: "'theme.css'", content: "'theme.css'" },
    ]);
  });

  it('should tokenize url function', () => {
    const input = '@import url(base.css)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'url', value: 'base.css', content: 'url(base.css)' },
    ]);
  });

  it('should tokenize url function with quotes', () => {
    const input = '@import url("components.css")';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'url', value: '"components.css"', content: 'url("components.css")' },
    ]);
  });
});

describe('@import - With Media Queries', () => {
  it('should tokenize import with media query', () => {
    const input = '@import "print.css" print';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"print.css"', content: '"print.css"' },
      { type: 'identifier', value: 'print', content: 'print' },
    ]);
  });

  it('should tokenize import with complex media query', () => {
    const input = '@import "mobile.css" screen and (max-width: 768px)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"mobile.css"', content: '"mobile.css"' },
      { type: 'identifier', value: 'screen', content: 'screen' },
      { type: 'operator', operator: 'and', content: 'and' },
      { type: 'delimiter', delimiter: '(', content: '(' },
      { type: 'identifier', value: 'max-width', content: 'max-width' },
      { type: 'delimiter', delimiter: ':', content: ':' },
      { type: 'dimension', value: 768, unit: 'px', content: '768px' },
      { type: 'delimiter', delimiter: ')', content: ')' },
    ]);
  });
});

describe('@import - With Supports', () => {
  it('should tokenize import with supports condition', () => {
    const input = '@import "grid.css" supports(display: grid)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"grid.css"', content: '"grid.css"' },
      { type: 'function', name: 'supports', argument: 'display: grid', content: 'supports(display: grid)' },
    ]);
  });
});

describe('@import - With Layer', () => {
  it('should tokenize import with layer', () => {
    const input = '@import "theme.css" layer(theme)';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"theme.css"', content: '"theme.css"' },
      { type: 'function', name: 'layer', argument: 'theme', content: 'layer(theme)' },
    ]);
  });

  it('should tokenize import with anonymous layer', () => {
    const input = '@import "utilities.css" layer';

    const tokens = tokenizeAtRule(input);

    expect(tokens).toEqual([
      { type: 'at-rule-name', name: 'import', content: '@import' },
      { type: 'string', value: '"utilities.css"', content: '"utilities.css"' },
      { type: 'identifier', value: 'layer', content: 'layer' },
    ]);
  });
});
