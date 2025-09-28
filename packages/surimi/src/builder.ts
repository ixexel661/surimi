import postcss from 'postcss';

import { buildSelectorWithRelationship, combineSelector, createDeclarations } from './css-generator';
import type { BuilderContext, CSSProperties, IMediaQueryBuilder, ISelectorBuilder } from './types';

/**
 * SelectorBuilder manages CSS rule generation using PostCSS AST manipulation.
 *
 * Key architectural decisions:
 * - Immutable context: Each method returns a new builder instance with updated context
 * - Shared PostCSS root: All selectors contribute to the same stylesheet AST
 * - Context inheritance: Pseudo-classes/elements are preserved until "consumed" by .style()
 * - Method chaining: .hover().media().style() preserves hover, .hover().style().media() resets to base
 */
export class SelectorBuilder implements ISelectorBuilder {
  private root: postcss.Root;
  private context: BuilderContext;

  constructor(baseSelector: string, root: postcss.Root, context?: Partial<BuilderContext>) {
    this.root = root;
    this.context = {
      baseSelector,
      pseudoClasses: [],
      pseudoElements: [],
      ...context,
    };
  }

  style(properties: CSSProperties): ISelectorBuilder {
    const rule = this.getOrCreateRule();
    const declarations = createDeclarations(properties);
    declarations.forEach(decl => rule.append(decl));

    // Clear pseudo-classes/elements after consuming them for this rule
    return new SelectorBuilder(this.context.baseSelector, this.root, {
      baseSelector: this.context.baseSelector,
      pseudoClasses: [],
      pseudoElements: [],
      mediaQuery: this.context.mediaQuery,
    });
  }

  /**
   * Get or create a PostCSS rule for the current context
   */
  private getOrCreateRule(): postcss.Rule {
    const completeSelector = combineSelector(
      this.context.baseSelector,
      this.context.pseudoClasses,
      this.context.pseudoElements,
    );

    // Check if rule already exists in the root or media query
    if (this.context.mediaQuery) {
      return this.getOrCreateMediaRule(completeSelector);
    }

    // Look for existing rule with this selector
    let existingRule = this.root.nodes.find(node => node.type === 'rule' && node.selector === completeSelector) as
      | postcss.Rule
      | undefined;

    if (!existingRule) {
      existingRule = postcss.rule({ selector: completeSelector });
      this.root.append(existingRule);
    }

    return existingRule;
  }

  /**
   * Get or create a media query rule
   */
  private getOrCreateMediaRule(selector: string): postcss.Rule {
    if (!this.context.mediaQuery) {
      throw new Error('Media query context is required');
    }

    // Find or create media query
    let mediaRule = this.root.nodes.find(
      node => node.type === 'atrule' && node.name === 'media' && node.params === this.context.mediaQuery,
    ) as postcss.AtRule | undefined;

    if (!mediaRule) {
      mediaRule = postcss.atRule({
        name: 'media',
        params: this.context.mediaQuery,
      });
      this.root.append(mediaRule);
    }

    // Find or create rule inside media query
    let rule = mediaRule.nodes?.find(node => node.type === 'rule' && node.selector === selector) as
      | postcss.Rule
      | undefined;

    if (!rule) {
      rule = postcss.rule({ selector });
      mediaRule.append(rule);
    }

    return rule;
  }

  hover(): ISelectorBuilder {
    return this.addPseudoClass('hover');
  }

  focus(): ISelectorBuilder {
    return this.addPseudoClass('focus');
  }

  active(): ISelectorBuilder {
    return this.addPseudoClass('active');
  }

  disabled(): ISelectorBuilder {
    return this.addPseudoClass('disabled');
  }

  before(): ISelectorBuilder {
    return this.addPseudoElement('before');
  }

  after(): ISelectorBuilder {
    return this.addPseudoElement('after');
  }

  media(query: string): IMediaQueryBuilder {
    return new MediaQueryBuilder(this.context.baseSelector, this.root, {
      ...this.context,
      mediaQuery: query,
    });
  }

  child(selector: string): ISelectorBuilder {
    // Apply current pseudo-classes and pseudo-elements to the base selector
    const currentBaseSelector = combineSelector(
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

    return new SelectorBuilder(newSelector, this.root, contextUpdate);
  }

  descendant(selector: string): ISelectorBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'descendant', selector);

    const contextUpdate: Partial<BuilderContext> = {
      pseudoClasses: [],
      pseudoElements: [],
    };

    if (this.context.mediaQuery) {
      contextUpdate.mediaQuery = this.context.mediaQuery;
    }

    return new SelectorBuilder(newSelector, this.root, contextUpdate);
  }

  private addPseudoClass(pseudoClass: string): ISelectorBuilder {
    const newContext = {
      ...this.context,
      pseudoClasses: [...this.context.pseudoClasses, pseudoClass],
    };

    return new SelectorBuilder(this.context.baseSelector, this.root, newContext);
  }

  private addPseudoElement(pseudoElement: string): ISelectorBuilder {
    const newContext = {
      ...this.context,
      pseudoElements: [...this.context.pseudoElements, pseudoElement],
    };

    return new SelectorBuilder(this.context.baseSelector, this.root, newContext);
  }
}

/**
 * MediaQueryBuilder handles CSS generation within @media rules.
 * Shares the same PostCSS root and context inheritance patterns as SelectorBuilder.
 */
export class MediaQueryBuilder implements IMediaQueryBuilder {
  private root: postcss.Root;
  private context: BuilderContext;

  constructor(_baseSelector: string, root: postcss.Root, context: BuilderContext) {
    this.root = root;
    this.context = context;
  }

  /**
   * Apply CSS properties within media query context
   */
  style(properties: CSSProperties): IMediaQueryBuilder {
    // Get or create rule in the shared PostCSS root (inside media query)
    const rule = this.getOrCreateMediaRule();

    // Add declarations to existing rule
    const declarations = createDeclarations(properties);
    declarations.forEach(decl => rule.append(decl));

    return this;
  }

  /**
   * Get or create a media query rule
   */
  private getOrCreateMediaRule(): postcss.Rule {
    if (!this.context.mediaQuery) {
      throw new Error('Media query context is required');
    }

    const completeSelector = combineSelector(
      this.context.baseSelector,
      this.context.pseudoClasses,
      this.context.pseudoElements,
    );

    // Find or create media query
    let mediaRule = this.root.nodes.find(
      node => node.type === 'atrule' && node.name === 'media' && node.params === this.context.mediaQuery,
    ) as postcss.AtRule | undefined;

    if (!mediaRule) {
      mediaRule = postcss.atRule({
        name: 'media',
        params: this.context.mediaQuery,
      });
      this.root.append(mediaRule);
    }

    // Find or create rule inside media query
    let rule = mediaRule.nodes?.find(node => node.type === 'rule' && node.selector === completeSelector) as
      | postcss.Rule
      | undefined;

    if (!rule) {
      rule = postcss.rule({ selector: completeSelector });
      mediaRule.append(rule);
    }

    return rule;
  }

  /**
   * Add :hover pseudo-class within media query
   */
  hover(): IMediaQueryBuilder {
    return this.addPseudoClass('hover');
  }

  /**
   * Add :focus pseudo-class within media query
   */
  focus(): IMediaQueryBuilder {
    return this.addPseudoClass('focus');
  }

  /**
   * Add :active pseudo-class within media query
   */
  active(): IMediaQueryBuilder {
    return this.addPseudoClass('active');
  }

  /**
   * Add :disabled pseudo-class within media query
   */
  disabled(): IMediaQueryBuilder {
    return this.addPseudoClass('disabled');
  }

  /**
   * Add ::before pseudo-element within media query
   */
  before(): IMediaQueryBuilder {
    return this.addPseudoElement('before');
  }

  /**
   * Add ::after pseudo-element within media query
   */
  after(): IMediaQueryBuilder {
    return this.addPseudoElement('after');
  }

  /**
   * Add direct child selector within media query
   */
  child(selector: string): IMediaQueryBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'child', selector);

    return new MediaQueryBuilder(newSelector, this.root, {
      ...this.context,
      baseSelector: newSelector,
      pseudoClasses: [],
      pseudoElements: [],
    });
  }

  /**
   * Add descendant selector within media query
   */
  descendant(selector: string): IMediaQueryBuilder {
    const newSelector = buildSelectorWithRelationship(this.context.baseSelector, 'descendant', selector);

    return new MediaQueryBuilder(newSelector, this.root, {
      ...this.context,
      baseSelector: newSelector,
      pseudoClasses: [],
      pseudoElements: [],
    });
  }

  /**
   * Helper method to add pseudo-class within media query
   */
  private addPseudoClass(pseudoClass: string): IMediaQueryBuilder {
    const newContext = {
      ...this.context,
      pseudoClasses: [...this.context.pseudoClasses, pseudoClass],
    };

    return new MediaQueryBuilder(this.context.baseSelector, this.root, newContext);
  }

  /**
   * Helper method to add pseudo-element within media query
   */
  private addPseudoElement(pseudoElement: string): IMediaQueryBuilder {
    const newContext = {
      ...this.context,
      pseudoElements: [...this.context.pseudoElements, pseudoElement],
    };

    return new MediaQueryBuilder(this.context.baseSelector, this.root, newContext);
  }
}
