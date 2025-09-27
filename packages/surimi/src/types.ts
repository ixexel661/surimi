import type * as CSS from 'csstype';

/**
 * CSS Properties using csstype for full TypeScript validation
 */
export type CSSProperties = CSS.Properties;

/**
 * Core builder interface that all builders must implement
 */
export interface Builder {
  /**
   * Generate the final CSS string
   */
  build(): string;
}

/**
 * Represents a CSS rule with selector and declarations
 */
export interface CSSRule {
  selector: string;
  declarations: CSSProperties;
  pseudoClasses: string[];
  pseudoElements: string[];
  mediaQuery?: string;
}

/**
 * Base selector builder interface with core functionality
 */
export interface SelectorBuilder extends Builder {
  // Style application
  style(properties: CSSProperties): SelectorBuilder;

  // Pseudo-classes
  hover(): SelectorBuilder;
  focus(): SelectorBuilder;
  active(): SelectorBuilder;
  disabled(): SelectorBuilder;

  // Pseudo-elements
  before(): SelectorBuilder;
  after(): SelectorBuilder;

  // Media queries
  media(query: string): MediaQueryBuilder;

  // Selector relationships
  child(selector: string): SelectorBuilder;
  descendant(selector: string): SelectorBuilder;

  // Future: Navigation (for Phase 3)
  // parent(): SelectorBuilder | null;
  // root(): SelectorBuilder;

  // Future: Combinations (for Phase 2)
  // and(selector: string): SelectorBuilder;
  // not(selector: string): SelectorBuilder;
  // adjacent(selector: string): SelectorBuilder;
  // sibling(selector: string): SelectorBuilder;
}

/**
 * Media query builder with specialized media functionality
 */
export interface MediaQueryBuilder extends Builder {
  // Apply styles within media query context
  style(properties: CSSProperties): MediaQueryBuilder;

  // Pseudo-classes within media queries
  hover(): MediaQueryBuilder;
  focus(): MediaQueryBuilder;
  active(): MediaQueryBuilder;
  disabled(): MediaQueryBuilder;

  // Pseudo-elements within media queries
  before(): MediaQueryBuilder;
  after(): MediaQueryBuilder;

  // Selector relationships within media queries
  child(selector: string): MediaQueryBuilder;
  descendant(selector: string): MediaQueryBuilder;

  // Future: Chained media queries (for Phase 3)
  // and(query: string): MediaQueryBuilder;
  // or(query: string): MediaQueryBuilder;
}

/**
 * Context for building CSS rules
 */
export interface BuilderContext {
  baseSelector: string;
  pseudoClasses: string[];
  pseudoElements: string[];
  mediaQuery?: string;
}

/**
 * Select function signature supporting multiple selector formats
 */
export type SelectFunction = (...selectors: string[]) => SelectorBuilder;
