export type { Tokenize } from './tokenize.types';
export type { Stringify } from './stringify.types';

export interface BaseToken {
  type: string;
  content: string;
}

export interface CommaToken extends BaseToken {
  type: 'comma';
}

export interface CombinatorToken extends BaseToken {
  type: 'combinator';
}

export interface NamedToken extends BaseToken {
  name: string;
}

export interface IdToken extends NamedToken {
  type: 'id';
}

export interface ClassToken extends NamedToken {
  type: 'class';
}

export interface PseudoElementToken extends NamedToken {
  type: 'pseudo-element';
  argument?: string;
}

export interface PseudoClassToken extends NamedToken {
  type: 'pseudo-class';
  argument?: string;
}

export interface NamespacedToken extends BaseToken {
  namespace?: string;
}

export interface UniversalToken extends NamespacedToken {
  type: 'universal';
}

export interface AttributeToken extends NamespacedToken, NamedToken {
  type: 'attribute';
  operator?: string;
  value?: string;
  caseSensitive?: 'i' | 'I' | 's' | 'S';
}

export interface TypeToken extends NamespacedToken, NamedToken {
  type: 'type';
}

export interface UnknownToken extends BaseToken {
  type: never;
}

export type Token =
  | AttributeToken
  | IdToken
  | ClassToken
  | CommaToken
  | CombinatorToken
  | PseudoElementToken
  | PseudoClassToken
  | UniversalToken
  | TypeToken
  | UnknownToken;
