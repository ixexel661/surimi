import type { Token } from './index';

/**
 * Recursively concatenates the content of all tokens into a string literal type.
 * Takes a readonly array of tokens and produces a string literal representing the selector.
 */
export type Stringify<T extends Token[]> = T extends readonly [infer First extends Token, ...infer Rest extends Token[]]
  ? `${First['content']}${Stringify<Rest>}`
  : '';

export type { Token };
