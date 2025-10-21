import type { Token } from './types';
import type { Stringify } from './types/stringify.types';

export function stringify<T extends Token[]>(tokens: T): Stringify<T> {
  return tokens.map(token => token.content).join('') as Stringify<T>;
}
