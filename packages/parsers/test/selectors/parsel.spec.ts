/**
 * Testing our tokenizer against the parsel-js tokenizer
 */

import { describe, expect, it } from 'vitest';

import { tokenizeSelector } from '#index';

describe('Compare tokenizer to parsel tokenized', () => {
  it('matches class tokenization', () => {
    const input = 'div.class.another';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });

  it('matches id tokenization', () => {
    const input = 'span#uniqueId';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });

  it('matches attribute tokenization', () => {
    const input = 'a[href="https://example.com"][target="_blank"]';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });

  it('matches pseudo-class tokenization', () => {
    const input = 'button:disabled:hover';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });

  it('matches pseudo-element tokenization', () => {
    const input = 'p::first-line';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });

  it('matches complex selector tokenization', () => {
    const input = 'div#container > ul.items li.item:first-child::before';

    const parselTokens = tokenizeSelector(input);
    const ourTokens = tokenizeSelector(input);

    expect(ourTokens).toEqual(parselTokens);
  });
});
