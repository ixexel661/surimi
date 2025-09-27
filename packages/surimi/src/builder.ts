import {
  buildCompleteSelector,
  buildSelectorWithRelationship,
  generateCSS,
  generateRule,
  normalizeSelectors,
} from './css-generator';
import type { BuilderContext, CSSProperties, CSSRule, MediaQueryBuilder, SelectorBuilder } from './types';

/**
 * Core selector builder implementation
 */
export class SelectorBuilderImpl implements SelectorBuilder {
  private rules: CSSRule[] = [];
  private context: BuilderContext;

  constructor(baseSelector: string, context?: Partial<BuilderContext>) {
    this.context = {
      baseSelector,
      pseudoClasses: [],
      pseudoElements: [],
      ...context,
    };
  }

  /**
   * Apply CSS properties to the current selector
   */
  style(properties: CSSProperties): SelectorBuilder {
    const rule: CSSRule = {
      selector: this.context.baseSelector,
      declarations: properties,
      pseudoClasses: [...this.context.pseudoClasses],
      pseudoElements: [...this.context.pseudoElements],
      ...(this.context.mediaQuery && { mediaQuery: this.context.mediaQuery }),
    };

    this.rules.push(rule);
    return this;
  }

  /**
   * Add :hover pseudo-class
   */
  hover(): SelectorBuilder {
    return this.addPseudoClass('hover');
  }

  /**
   * Add :focus pseudo-class
   */
  focus(): SelectorBuilder {
    return this.addPseudoClass('focus');
  }

  /**
   * Add :active pseudo-class
   */
  active(): SelectorBuilder {
    return this.addPseudoClass('active');
  }

  /**
   * Add :disabled pseudo-class
   */
  disabled(): SelectorBuilder {
    return this.addPseudoClass('disabled');
  }

  /**
   * Add ::before pseudo-element
   */
  before(): SelectorBuilder {
    return this.addPseudoElement('before');
  }

  /**
   * Add ::after pseudo-element
   */
  after(): SelectorBuilder {
    return this.addPseudoElement('after');
  }

  /**
   * Create media query context
   */
  media(query: string): MediaQueryBuilder {
    return new MediaQueryBuilderImpl(
      this.context.baseSelector,
      {
        ...this.context,
        mediaQuery: query,
      },
      this.rules,
    );
  }

  /**
   * Add direct child selector
   */
  child(selector: string): SelectorBuilder {
    // Apply current pseudo-classes and pseudo-elements to the base selector
    const currentBaseSelector = buildCompleteSelector(
      this.context.baseSelector,
      this.context.pseudoClasses,
      this.context.pseudoElements,
    );

    const newSelector = buildSelectorWithRelationship(currentBaseSelector, 'child', selector);

    const contextUpdate: Partial<BuilderContext> = {
      pseudoClasses: [],
      pseudoElements: [],
    };

    if (this.context.mediaQuery) {
      contextUpdate.mediaQuery = this.context.mediaQuery;
    }

    const newBuilder = new SelectorBuilderImpl(newSelector, contextUpdate);
    // Share the rules array so all operations contribute to the same collection
    newBuilder.rules = this.rules;
    return newBuilder;
  }

  /**
   * Add descendant selector
   */
  descendant(selector: string): SelectorBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'descendant', selector);

    const contextUpdate: Partial<BuilderContext> = {
      pseudoClasses: [],
      pseudoElements: [],
    };

    if (this.context.mediaQuery) {
      contextUpdate.mediaQuery = this.context.mediaQuery;
    }

    const newBuilder = new SelectorBuilderImpl(newSelector, contextUpdate);
    // Share the rules array so all operations contribute to the same collection
    newBuilder.rules = this.rules;
    return newBuilder;
  }

  /**
   * Generate final CSS output
   */
  build(): string {
    if (this.rules.length === 0) {
      return '';
    }

    if (this.rules.length === 1) {
      const firstRule = this.rules[0];
      if (firstRule) {
        return generateRule(firstRule);
      }
    }

    return generateCSS(this.rules);
  }

  /**
   * Helper method to add pseudo-class
   */
  private addPseudoClass(pseudoClass: string): SelectorBuilder {
    const newContext = {
      ...this.context,
      pseudoClasses: [...this.context.pseudoClasses, pseudoClass],
    };

    const newBuilder = new SelectorBuilderImpl(this.context.baseSelector, newContext);
    // Share the rules array so all operations contribute to the same collection
    newBuilder.rules = this.rules;
    return newBuilder;
  }

  /**
   * Helper method to add pseudo-element
   */
  private addPseudoElement(pseudoElement: string): SelectorBuilder {
    const newContext = {
      ...this.context,
      pseudoElements: [...this.context.pseudoElements, pseudoElement],
    };

    const newBuilder = new SelectorBuilderImpl(this.context.baseSelector, newContext);
    // Share the rules array so all operations contribute to the same collection
    newBuilder.rules = this.rules;
    return newBuilder;
  }
}

/**
 * Media query builder implementation
 */
export class MediaQueryBuilderImpl implements MediaQueryBuilder {
  private rules: CSSRule[] = [];
  private context: BuilderContext;

  constructor(_baseSelector: string, context: BuilderContext, existingRules: CSSRule[] = []) {
    this.context = context;
    this.rules = existingRules; // Share the same rules array reference
  }

  /**
   * Apply CSS properties within media query context
   */
  style(properties: CSSProperties): MediaQueryBuilder {
    const rule: CSSRule = {
      selector: this.context.baseSelector,
      declarations: properties,
      pseudoClasses: [...this.context.pseudoClasses],
      pseudoElements: [...this.context.pseudoElements],
      ...(this.context.mediaQuery && { mediaQuery: this.context.mediaQuery }),
    };

    this.rules.push(rule);
    return this;
  }

  /**
   * Add :hover pseudo-class within media query
   */
  hover(): MediaQueryBuilder {
    return this.addPseudoClass('hover');
  }

  /**
   * Add :focus pseudo-class within media query
   */
  focus(): MediaQueryBuilder {
    return this.addPseudoClass('focus');
  }

  /**
   * Add :active pseudo-class within media query
   */
  active(): MediaQueryBuilder {
    return this.addPseudoClass('active');
  }

  /**
   * Add :disabled pseudo-class within media query
   */
  disabled(): MediaQueryBuilder {
    return this.addPseudoClass('disabled');
  }

  /**
   * Add ::before pseudo-element within media query
   */
  before(): MediaQueryBuilder {
    return this.addPseudoElement('before');
  }

  /**
   * Add ::after pseudo-element within media query
   */
  after(): MediaQueryBuilder {
    return this.addPseudoElement('after');
  }

  /**
   * Add direct child selector within media query
   */
  child(selector: string): MediaQueryBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'child', selector);

    return new MediaQueryBuilderImpl(
      newSelector,
      {
        ...this.context,
        baseSelector: newSelector,
        pseudoClasses: [],
        pseudoElements: [],
      },
      this.rules,
    );
  }

  /**
   * Add descendant selector within media query
   */
  descendant(selector: string): MediaQueryBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'descendant', selector);

    return new MediaQueryBuilderImpl(
      newSelector,
      {
        ...this.context,
        baseSelector: newSelector,
        pseudoClasses: [],
        pseudoElements: [],
      },
      this.rules,
    );
  }

  /**
   * Generate final CSS output
   */
  build(): string {
    if (this.rules.length === 0) {
      return '';
    }

    if (this.rules.length === 1 && this.rules[0]) {
      return generateRule(this.rules[0]);
    }

    return generateCSS(this.rules);
  }

  /**
   * Helper method to add pseudo-class within media query
   */
  private addPseudoClass(pseudoClass: string): MediaQueryBuilder {
    const newContext = {
      ...this.context,
      pseudoClasses: [...this.context.pseudoClasses, pseudoClass],
    };

    return new MediaQueryBuilderImpl(this.context.baseSelector, newContext, this.rules);
  }

  /**
   * Helper method to add pseudo-element within media query
   */
  private addPseudoElement(pseudoElement: string): MediaQueryBuilder {
    const newContext = {
      ...this.context,
      pseudoElements: [...this.context.pseudoElements, pseudoElement],
    };

    return new MediaQueryBuilderImpl(this.context.baseSelector, newContext, this.rules);
  }
}

/**
 * Main select function that creates a selector builder
 */
export function select(...selectors: string[]): SelectorBuilder {
  const normalizedSelector = normalizeSelectors(...selectors);
  return new SelectorBuilderImpl(normalizedSelector);
}
