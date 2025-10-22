export type { Tokenize } from './tokenize.types';
export type { Stringify } from './stringify.types';

/**
 * Base token interface for all at-rule tokens
 */
export interface BaseToken {
  type: string;
  content: string;
}

/**
 * The @-keyword token that starts an at-rule
 * Examples: @media, @container, @keyframes, @property
 */
export interface AtRuleNameToken extends BaseToken {
  type: 'at-rule-name';
  name: string; // without the @ symbol
}

/**
 * An identifier token (unquoted name)
 * Examples: screen, print, hover, portrait, all
 */
export interface IdentifierToken extends BaseToken {
  type: 'identifier';
  value: string;
}

/**
 * A function token with its name and argument content
 * Examples: min-width(768px), selector(:hover)
 */
export interface FunctionToken extends BaseToken {
  type: 'function';
  name: string;
  argument: string; // content between parentheses
}

/**
 * A quoted string token
 * Examples: "Roboto", 'Arial', "my-animation"
 */
export interface StringToken extends BaseToken {
  type: 'string';
  value: string; // includes quotes
}

/**
 * A numeric value without units
 * Examples: 0, 100, 2.5, -3.14
 */
export interface NumberToken extends BaseToken {
  type: 'number';
  value: number;
}

/**
 * A numeric value with a unit
 * Examples: 768px, 1rem, 50%, 2s, 90deg
 */
export interface DimensionToken extends BaseToken {
  type: 'dimension';
  value: number;
  unit: string;
}

/**
 * A percentage value
 * Examples: 50%, 100%, 33.333%
 */
export interface PercentageToken extends BaseToken {
  type: 'percentage';
  value: number;
}

/**
 * Operator tokens (logical and comparison)
 * Examples: and, or, not, >, <, =, >=, <=
 */
export interface OperatorToken extends BaseToken {
  type: 'operator';
  operator: string;
}

/**
 * Delimiter tokens (structural characters)
 * Examples: (, ), ,, :, /
 */
export interface DelimiterToken extends BaseToken {
  type: 'delimiter';
  delimiter: string;
}

/**
 * Whitespace token (optional, for preserving spacing)
 */
export interface WhitespaceToken extends BaseToken {
  type: 'whitespace';
}

/**
 * Hash/color token
 * Examples: #fff, #ff0000
 */
export interface HashToken extends BaseToken {
  type: 'hash';
  value: string; // without the # symbol
}

/**
 * URL token
 * Examples: url(image.png), url("font.woff2")
 */
export interface UrlToken extends BaseToken {
  type: 'url';
  value: string;
}

/**
 * Unknown/fallback token
 */
export interface UnknownToken extends BaseToken {
  type: 'unknown';
}

/**
 * Value token (simplified type-level representation)
 * Used by the type-level tokenizer to represent numbers, dimensions, and percentages
 * as a single token type with the value as a string
 */
export interface ValueToken extends BaseToken {
  type: 'value';
  value: string;
}

/**
 * Union of all at-rule token types
 */
export type Token =
  | AtRuleNameToken
  | IdentifierToken
  | FunctionToken
  | StringToken
  | NumberToken
  | DimensionToken
  | PercentageToken
  | OperatorToken
  | DelimiterToken
  | WhitespaceToken
  | HashToken
  | UrlToken
  | ValueToken
  | UnknownToken;
