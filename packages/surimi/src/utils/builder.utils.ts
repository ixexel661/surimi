/**
 * Shared utils across different builders / mixins.
 */

import selectorParser from 'postcss-selector-parser';

import type { ExtractBuildContextFromString, FlatBuilderContext } from '#types/builder.types';
import type { SelectorRelationship } from '#types/css.types';
import type { JoinSelectors } from '#types/selector.types';

/**
 * Combine multiple selectors and pseudoElements / pseudoClasses into a single selector string.
 *
 * Processes items in the order they appear, applying pseudo-classes and pseudo-elements
 * to the most recent selector. This ensures proper CSS selector structure.
 *
 * @example
 * ```typescript
 * combineSelectors([
 *   { selector: '.form' },
 *   { selector: 'input', relation: 'child' },
 *   { pseudoClass: 'first-child' },
 *   { selector: '.label', relation: 'adjacent' },
 * ]);
 * // Returns: '.form > input:first-child + .label'
 * ```
 *
 * @example
 * ```typescript
 * combineSelectors([
 *   { selector: '.button' },
 *   { pseudoClass: 'hover' },
 *   { pseudoElement: 'after' },
 * ]);
 * // Returns: '.button:hover::after'
 * ```
 *
 * @example
 * ```typescript
 * combineSelectors([
 *   { group: [
 *     { selector: 'a.link' },
 *     { selector: '.link' },
 *   ] },
 *   { pseudoClass: 'visited' },
 * ]);
 * // Returns: 'a.link:visited, .link:visited'
 * ```
 */
export function combineSelectors(items: FlatBuilderContext): string {
  const groupItems = items.filter(item => 'group' in item);

  // Handle groups first - apply all non-group items to each group selector
  if (groupItems.length > 0) {
    const nonGroupItems = items.filter(item => !('group' in item));
    const allGroupSelectors = groupItems.flatMap(groupItem => extractSelectorsFromGroup(groupItem.group));

    return allGroupSelectors
      .map(groupSelector => {
        const contextWithGroupSelector = [{ selector: groupSelector }, ...nonGroupItems];
        return combineSelectorsSequentially(contextWithGroupSelector);
      })
      .join(', ');
  }

  return combineSelectorsSequentially(items);
}

/**
 * Recursively extract all selectors from a group, flattening nested groups
 */
function extractSelectorsFromGroup(group: FlatBuilderContext): string[] {
  const selectors: string[] = [];

  for (const item of group) {
    if ('selector' in item) {
      selectors.push(item.selector);
    } else if ('group' in item) {
      selectors.push(...extractSelectorsFromGroup(item.group));
    }
  }

  return selectors;
}

/**
 * Combine items sequentially, building the selector from left to right
 */
function combineSelectorsSequentially(items: FlatBuilderContext): string {
  let result = '';

  for (const item of items) {
    if ('selector' in item) {
      if (result === '') {
        // First selector - no relationship needed
        result = item.selector;
      } else {
        // Subsequent selector - use its relationship to combine with previous result
        const relationship = item.relation ?? 'descendant';
        result = buildSelectorWithRelationship(result, relationship, item.selector);
      }
    } else if ('pseudoClass' in item) {
      // Apply pseudo-class to the last selector in the result
      result += `:${item.pseudoClass}`;
    } else if ('pseudoElement' in item) {
      // Apply pseudo-element to the last selector in the result
      result += `::${item.pseudoElement}`;
    }
    // Skip group items as they are handled at the top level
  }

  return result;
}

/**
 * Builds a selector with a relationship combinator
 */
export function buildSelectorWithRelationship(
  baseSelector: string,
  relationship: SelectorRelationship,
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
      throw new Error(`Unknown relationship type: ${relationship as string}`);
  }
}

/**
 * Join multiple selectors with comma separation
 */
export function joinSelectors<TSelectors extends string[]>(...selectors: TSelectors): JoinSelectors<TSelectors> {
  return selectors.join(', ') as JoinSelectors<TSelectors>;
}

/**
 * Parse a selector string into its build context representation
 * For example, '.button:hover::after' becomes
 * [
 *   { selector: '.button' },
 *   { pseudoClass: 'hover' },
 *   { pseudoElement: 'after' },
 * ]
 *
 * Uses postcss-selector-parser for robust CSS selector parsing.
 * Supports:
 * - Simple selectors (class, ID, element, attribute)
 * - Pseudo-classes (:hover, :focus, etc.)
 * - Pseudo-elements (::before, ::after, etc.)
 * - Combinators (>, +, ~, space for descendant)
 * - Complex selectors with parentheses and quoted values
 *
 * This does NOT support media queries, groups, or other advanced BuildContext features.
 */
export function parseSelectorString<S extends string>(selector: S): ExtractBuildContextFromString<S> {
  if (!selector || selector.trim() === '') {
    return [] as ExtractBuildContextFromString<S>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];

  try {
    selectorParser(selectors => {
      // Handle comma-separated selectors - process each one individually
      selectors.each(selectorNode => {
        console.log('Parsing selector node:', selectorNode.toString());
        const parsed = parseSingleSelectorNode(selectorNode);
        result.push(...parsed);
      });
    }).processSync(selector.trim());
  } catch (error) {
    // If parsing fails, fall back to treating it as a simple selector
    console.warn(`Failed to parse selector "${selector}":`, error);
    result.push({ selector: selector.trim() });
  }

  return result as ExtractBuildContextFromString<S>;
}

interface BuildContextItem {
  selector?: string;
  pseudoClass?: string;
  pseudoElement?: string;
  relation?: 'child' | 'adjacent' | 'sibling' | 'descendant';
}

/**
 * Parse a single selector node from postcss-selector-parser into build context items
 */
function parseSingleSelectorNode(selectorNode: selectorParser.Selector): BuildContextItem[] {
  // Use postcss-selector-parser's built-in combinator detection rather than regex
  const result: BuildContextItem[] = [];
  let currentCompound: BuildContextItem[] = [];
  let pendingRelation: 'child' | 'adjacent' | 'sibling' | 'descendant' | undefined;

  selectorNode.each(node => {
    switch (node.type) {
      case 'combinator': {
        // Flush current compound
        if (currentCompound.length > 0) {
          result.push(...currentCompound);
          currentCompound = [];
        }

        // Set pending relation for next compound
        switch (node.value.trim()) {
          case '>':
            pendingRelation = 'child';
            break;
          case '+':
            pendingRelation = 'adjacent';
            break;
          case '~':
            pendingRelation = 'sibling';
            break;
          default:
            pendingRelation = 'descendant';
        }
        break;
      }

      case 'tag':
      case 'class':
      case 'id':
      case 'attribute':
      case 'universal': {
        // If we don't have a base selector yet, create one
        if (currentCompound.length === 0 || !currentCompound.some(item => item.selector)) {
          const baseItem: BuildContextItem = { selector: node.toString() };

          // Add pending relation if we have one
          if (pendingRelation) {
            baseItem.relation = pendingRelation;
            pendingRelation = undefined;
          }

          currentCompound.push(baseItem);
        } else {
          // Append to existing base selector
          const baseItem = currentCompound.find(item => item.selector);
          if (baseItem?.selector) {
            baseItem.selector += node.toString();
          }
        }
        break;
      }

      case 'pseudo': {
        // Use toString() to get the full pseudo-class including functional notation
        const fullPseudo = node.toString();
        const pseudoValue = fullPseudo.replace(/^::?/, ''); // Remove : or ::

        if (fullPseudo.startsWith('::')) {
          currentCompound.push({ pseudoElement: pseudoValue });
        } else {
          currentCompound.push({ pseudoClass: pseudoValue });
        }
        break;
      }

      default: {
        // Handle other node types by adding to base selector
        if (currentCompound.length === 0 || !currentCompound.some(item => item.selector)) {
          const baseItem: BuildContextItem = { selector: node.toString() };

          if (pendingRelation) {
            baseItem.relation = pendingRelation;
            pendingRelation = undefined;
          }

          currentCompound.push(baseItem);
        } else {
          const baseItem = currentCompound.find(item => item.selector);
          if (baseItem?.selector) {
            baseItem.selector += node.toString();
          }
        }
        break;
      }
    }
  });

  // Flush final compound
  if (currentCompound.length > 0) {
    // Add pending relation to the first selector item
    if (pendingRelation) {
      const firstSelectorItem = currentCompound.find(item => item.selector);
      if (firstSelectorItem) {
        firstSelectorItem.relation = pendingRelation;
      }
    }

    result.push(...currentCompound);
  }

  return result;
}
