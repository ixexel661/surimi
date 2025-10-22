import type { Token } from '../../types/at-rules/index';

/**
 * Stringify an array of at-rule tokens back into a string
 *
 * @param tokens - Array of tokens to stringify
 * @returns The reconstructed at-rule string
 */
export function stringifyAtRule(tokens: Token[]): string {
  return tokens.map(token => token.content).join(' ');
}
