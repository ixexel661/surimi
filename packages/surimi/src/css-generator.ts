import postcss, { type AtRule, type Declaration, type Rule } from 'postcss';

import type { CSSProperties, CSSRule } from './types';

/**
 * Convert camelCase CSS property names to kebab-case
 */
export function formatPropertyName(property: string): string {
  return property.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Format a CSS property value, handling numbers appropriately
 */
export function formatPropertyValue(value: unknown): string {
  if (typeof value === 'number') {
    return value.toString();
  }
  return String(value);
}

/**
 * Create PostCSS declarations from properties object
 */
export function createDeclarations(properties: CSSProperties): Declaration[] {
  const declarations: Declaration[] = [];

  for (const [property, value] of Object.entries(properties)) {
    if (value !== undefined && value !== null) {
      const formattedProperty = formatPropertyName(property);
      const formattedValue = formatPropertyValue(value);

      const declaration = postcss.decl({
        prop: formattedProperty,
        value: formattedValue,
      });

      declarations.push(declaration);
    }
  }

  return declarations;
}

/**
 * Build complete selector string with pseudo-classes and pseudo-elements
 */
export function buildCompleteSelector(
  baseSelector: string,
  pseudoClasses: string[] = [],
  pseudoElements: string[] = [],
): string {
  let selector = baseSelector;

  // Add pseudo-classes (e.g., :hover, :focus)
  for (const pseudoClass of pseudoClasses) {
    selector += `:${pseudoClass}`;
  }

  // Add pseudo-elements (e.g., ::before, ::after)
  for (const pseudoElement of pseudoElements) {
    selector += `::${pseudoElement}`;
  }

  return selector;
}

/**
 * Create a PostCSS rule from CSSRule
 */
export function createRule(cssRule: CSSRule): Rule {
  const selector = buildCompleteSelector(cssRule.selector, cssRule.pseudoClasses, cssRule.pseudoElements);

  const rule = postcss.rule({ selector });
  const declarations = createDeclarations(cssRule.declarations);

  for (const declaration of declarations) {
    rule.append(declaration);
  }

  return rule;
}

/**
 * Create a PostCSS media query with rule
 */
export function createMediaRule(cssRule: CSSRule): AtRule {
  if (!cssRule.mediaQuery) {
    throw new Error('Media query is required for createMediaRule');
  }

  const rule = createRule(cssRule);
  const mediaRule = postcss.atRule({
    name: 'media',
    params: cssRule.mediaQuery,
  });

  mediaRule.append(rule);
  return mediaRule;
}

/**
 * Format PostCSS output with minimal changes - just add semicolons and handle empty rules
 */
function formatCSSOutput(css: string): string {
  return (
    css
      // Add semicolons to property declarations (lines with only spaces and non-braces)
      .replace(/^(\s+[^{}]+)$/gm, '$1;')
      // Handle empty rules
      .replace(/\{\}/g, '{\n}')
  );
}

/**
 * Generate CSS from CSSRule using PostCSS
 */
export function generateRule(cssRule: CSSRule): string {
  const root = postcss.root();

  if (cssRule.mediaQuery) {
    const mediaRule = createMediaRule(cssRule);
    root.append(mediaRule);
  } else {
    const rule = createRule(cssRule);
    root.append(rule);
  }

  return formatCSSOutput(root.toString());
}

/**
 * Generate CSS from multiple rules using PostCSS
 */
export function generateCSS(rules: CSSRule[]): string {
  if (rules.length === 0) {
    return '';
  }

  if (rules.length === 1) {
    const firstRule = rules[0];
    if (firstRule) {
      return generateRule(firstRule);
    }
  }

  // For multiple rules, generate each rule separately and join with blank lines
  const generatedRules = rules.map(rule => generateRule(rule));
  return generatedRules.join('\n\n');
}

/**
 * Normalize selector strings (handle multiple selectors)
 */
export function normalizeSelectors(...selectors: string[]): string {
  return selectors.join(', ');
}

/**
 * Parse selector relationships (child, descendant, etc.)
 */
export function buildSelectorWithRelationship(
  baseSelector: string,
  relationship: 'child' | 'descendant' | 'adjacent' | 'sibling',
  targetSelector: string,
): string {
  switch (relationship) {
    case 'child':
      return `${baseSelector} > ${targetSelector}`;
    case 'descendant':
      return `${baseSelector} ${targetSelector}`;
    case 'adjacent':
      return `${baseSelector} + ${targetSelector}`;
    case 'sibling':
      return `${baseSelector} ~ ${targetSelector}`;
    default:
      return `${baseSelector} ${targetSelector}`;
  }
}
