/**
 * Type definitions for Surimi CSS builder.
 *
 * Key architectural patterns:
 * - Interface/Implementation separation: I* interfaces define contracts, classes provide implementation
 * - Immutable builder pattern: Each method returns new instance rather than mutating current one
 * - Context-aware building: BuilderContext carries state through method chains
 */
import type * as CSS from 'csstype';

export type CSSProperties = CSS.Properties;

/**
 * Base selector builder interface with core functionality
 */
export interface ISelectorBuilder {
  // Style application
  style(properties: CSSProperties): ISelectorBuilder;

  // Pseudo-classes
  hover(): ISelectorBuilder;
  focus(): ISelectorBuilder;
  active(): ISelectorBuilder;
  disabled(): ISelectorBuilder;

  // Pseudo-elements
  before(): ISelectorBuilder;
  after(): ISelectorBuilder;

  // Media queries
  media(query: string): IMediaQueryBuilder;

  // Selector relationships
  child(selector: string): ISelectorBuilder;
  descendant(selector: string): ISelectorBuilder;

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
export interface IMediaQueryBuilder {
  // Apply styles within media query context
  style(properties: CSSProperties): IMediaQueryBuilder;

  // Pseudo-classes within media queries
  hover(): IMediaQueryBuilder;
  focus(): IMediaQueryBuilder;
  active(): IMediaQueryBuilder;
  disabled(): IMediaQueryBuilder;

  // Pseudo-elements within media queries
  before(): IMediaQueryBuilder;
  after(): IMediaQueryBuilder;

  // Selector relationships within media queries
  child(selector: string): IMediaQueryBuilder;
  descendant(selector: string): IMediaQueryBuilder;

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
  mediaQuery?: string | undefined;
}

/**
 * Select function signature supporting multiple selector formats
 */
export type SelectFunction = (...selectors: string[]) => ISelectorBuilder;
