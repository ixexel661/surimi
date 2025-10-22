import type { Token } from './index';

/**
 * Type-level stringify for CSS at-rules
 * Converts token types back to string types
 */

/**
 * Recursively concatenates the content of all tokens into a string literal type.
 * Takes a readonly array of tokens and produces a string literal representing the at-rule prelude.
 * Tokens are joined with spaces.
 */
type StringifyImpl<T extends Token[], First extends boolean = true> = T extends readonly [
  infer Head extends Token,
  ...infer Tail extends Token[],
]
  ? First extends true
    ? `${Head['content']}${StringifyImpl<Tail, false>}`
    : ` ${Head['content']}${StringifyImpl<Tail, false>}`
  : '';

/**
 * Public stringify type that converts an array of at-rule tokens to a string
 */
export type Stringify<T extends Token[]> = StringifyImpl<T>;
