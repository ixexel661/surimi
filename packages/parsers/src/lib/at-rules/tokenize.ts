import type { Token, Tokenize } from '../../types/at-rules/index';

/**
 * Tokenize a CSS at-rule prelude (everything before the {)
 *
 * Examples:
 * - "@media screen and (min-width: 768px)"
 * - "@container (min-width: 400px)"
 * - "@keyframes slide-in"
 * - "@property --my-color"
 * - "@font-face"
 *
 * @param input - The at-rule string to tokenize
 * @returns Array of tokens
 */
export function tokenizeAtRule<S extends string>(input: S): Tokenize<S> {
  const tokens: Token[] = [];
  let pos = 0;

  // Helper: Check if character is whitespace
  const isWhitespace = (char: string): boolean => {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  };

  // Helper: Check if character is a digit
  const isDigit = (char: string): boolean => {
    return char >= '0' && char <= '9';
  };

  // Helper: Check if character can start an identifier
  const isIdentifierStart = (char: string): boolean => {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '-' || char === '_';
  };

  // Helper: Check if character can be in an identifier
  const isIdentifierChar = (char: string): boolean => {
    return isIdentifierStart(char) || isDigit(char);
  };

  // Helper: Skip whitespace
  const skipWhitespace = (): void => {
    while (pos < input.length && isWhitespace(input[pos]!)) {
      pos++;
    }
  };

  // Helper: Read an identifier
  const readIdentifier = (): string => {
    const start = pos;
    while (pos < input.length && isIdentifierChar(input[pos]!)) {
      pos++;
    }
    return input.slice(start, pos);
  };

  // Helper: Read a number (int or float)
  const readNumber = (): { value: number; hasDecimal: boolean } => {
    const start = pos;
    let hasDecimal = false;

    // Handle negative sign
    if (input[pos] === '-' || input[pos] === '+') {
      pos++;
    }

    // Read digits before decimal
    while (pos < input.length && isDigit(input[pos]!)) {
      pos++;
    }

    // Handle decimal point
    if (pos < input.length && input[pos] === '.' && pos + 1 < input.length && isDigit(input[pos + 1]!)) {
      hasDecimal = true;
      pos++; // skip .
      while (pos < input.length && isDigit(input[pos]!)) {
        pos++;
      }
    }

    const numStr = input.slice(start, pos);
    return { value: parseFloat(numStr), hasDecimal };
  };

  // Helper: Read a quoted string
  const readQuotedString = (quote: string): string => {
    let result = quote;
    pos++; // skip opening quote
    let escaped = false;

    while (pos < input.length) {
      const char = input[pos]!;
      result += char;

      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        pos++;
        return result;
      }

      pos++;
    }

    return result;
  };

  // Helper: Read until closing parenthesis (with nesting support)
  const readUntilCloseParen = (): string => {
    let result = '';
    let depth = 1;
    let escaped = false;
    let inString: string | null = null;

    while (pos < input.length && depth > 0) {
      const char = input[pos]!;

      if (inString) {
        result += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === inString) {
          inString = null;
        }
      } else {
        if (char === '"' || char === "'") {
          inString = char;
          result += char;
        } else if (char === '(') {
          depth++;
          result += char;
        } else if (char === ')') {
          depth--;
          if (depth > 0) {
            result += char;
          }
        } else {
          result += char;
        }
      }

      pos++;
    }

    return result;
  };

  // Main tokenization loop
  while (pos < input.length) {
    const char = input[pos]!;

    // Skip whitespace (we don't emit whitespace tokens by default)
    if (isWhitespace(char)) {
      skipWhitespace();
      continue;
    }

    // At-rule name (@media, @container, etc.)
    if (char === '@') {
      const start = pos;
      pos++; // skip @
      const name = readIdentifier();
      tokens.push({
        type: 'at-rule-name',
        name,
        content: `@${name}`,
      });
      continue;
    }

    // String literals
    if (char === '"' || char === "'") {
      const start = pos;
      const value = readQuotedString(char);
      tokens.push({
        type: 'string',
        value,
        content: value,
      });
      continue;
    }

    // Hash/Color
    if (char === '#') {
      const start = pos;
      pos++; // skip #
      let value = '';
      while (pos < input.length && (isIdentifierChar(input[pos]!) || isDigit(input[pos]!))) {
        value += input[pos];
        pos++;
      }
      tokens.push({
        type: 'hash',
        value,
        content: `#${value}`,
      });
      continue;
    }

    // Numbers, dimensions, percentages
    if (
      isDigit(char) ||
      (char === '-' && pos + 1 < input.length && isDigit(input[pos + 1]!)) ||
      (char === '+' && pos + 1 < input.length && isDigit(input[pos + 1]!)) ||
      (char === '.' && pos + 1 < input.length && isDigit(input[pos + 1]!))
    ) {
      const start = pos;
      const { value } = readNumber();

      // Check for unit/dimension
      if (pos < input.length && isIdentifierStart(input[pos]!)) {
        const unit = readIdentifier();
        tokens.push({
          type: 'dimension',
          value,
          unit,
          content: input.slice(start, pos),
        });
      }
      // Check for percentage
      else if (pos < input.length && input[pos] === '%') {
        pos++;
        tokens.push({
          type: 'percentage',
          value,
          content: input.slice(start, pos),
        });
      }
      // Just a number
      else {
        tokens.push({
          type: 'number',
          value,
          content: input.slice(start, pos),
        });
      }
      continue;
    }

    // Identifiers and keywords (and, or, not, etc.)
    if (isIdentifierStart(char)) {
      const start = pos;
      const value = readIdentifier();

      // Check if it's a logical operator (and, or, not) - these are NOT functions even if followed by (
      if (value === 'and' || value === 'or' || value === 'not') {
        tokens.push({
          type: 'operator',
          operator: value,
          content: value,
        });
      }
      // Check if it's followed by a parenthesis (function)
      else {
        skipWhitespace();
        if (pos < input.length && input[pos] === '(') {
          pos++; // skip (
          const argument = readUntilCloseParen();

          // Special handling for url() function
          if (value === 'url') {
            tokens.push({
              type: 'url',
              value: argument.trim(),
              content: `url(${argument})`,
            });
          } else {
            tokens.push({
              type: 'function',
              name: value,
              argument,
              content: `${value}(${argument})`,
            });
          }
        }
        // Regular identifier
        else {
          tokens.push({
            type: 'identifier',
            value,
            content: value,
          });
        }
      }
      continue;
    }

    // Operators (>=, <=, =, <, >)
    if (char === '>' || char === '<' || char === '=') {
      const start = pos;
      let operator = char;
      pos++;

      // Check for two-character operators
      if (pos < input.length && input[pos] === '=') {
        operator += '=';
        pos++;
      }

      tokens.push({
        type: 'operator',
        operator,
        content: operator,
      });
      continue;
    }

    // Delimiters
    if (char === '(' || char === ')' || char === ',' || char === ':' || char === '/') {
      tokens.push({
        type: 'delimiter',
        delimiter: char,
        content: char,
      });
      pos++;
      continue;
    }

    // Unknown character - skip it
    pos++;
  }

  return tokens as Tokenize<S>;
}
