import postcss from 'postcss';

import { SelectorBuilder } from '#builder';
import { joinSelectors } from '#css-generator';
import type { ISelectorBuilder } from '#types';

/**
 * Surimi CSS builder with global stylesheet management
 *
 * Provides a singleton pattern for managing CSS generation across multiple files.
 * Uses PostCSS internally for efficient CSS AST manipulation and generation.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Surimi {
  private static root: postcss.Root = postcss.root();
  private static selectors = new Map<string, ISelectorBuilder>();

  /**
   * Create a selector builder for the given selectors
   */
  static select(...selectors: string[]): ISelectorBuilder {
    const normalizedSelector = joinSelectors(...selectors);

    // Reuse existing selector builder if it exists, or create new one
    const existing = this.selectors.get(normalizedSelector);
    if (existing) {
      return existing;
    }

    const builder = new SelectorBuilder(normalizedSelector, this.root);
    this.selectors.set(normalizedSelector, builder);
    return builder;
  }

  /**
   * Generate final CSS for all selectors
   */
  static build(): string {
    return this.root.toString();
  }

  /**
   * Clear all rules and selectors (useful for testing and file-based builds)
   */
  static clear(): void {
    this.root = postcss.root();
    this.selectors.clear();
  }

  /**
   * Get the PostCSS root for advanced usage
   */
  static getRoot(): postcss.Root {
    return this.root;
  }
}
