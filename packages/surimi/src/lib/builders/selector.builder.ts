import { mix } from 'ts-mixer';

import { CoreBuilder } from './core.builder';
import { WithNavigation, WithPseudoClasses, WithPseudoElements, WithSelecting, WithStyling } from './mixins';
import { Tokenize, tokenizeSelector } from '@surimi/parsers';
import { ValidSelector } from '#types/selector.types';

export interface SelectorBuilder<T extends string>
  extends WithNavigation<T>,
    WithStyling<T>,
    WithPseudoClasses<T>,
    WithPseudoElements<T>,
    WithSelecting<T> {}

/**
 * The primary way to select things in Surimi.
 * Provides ways to select elements, navigate the DOM, target pseudo-elements, pseudo classes and apply styles.
 *
 * You usually don't instantiate this class directly, but rather start from a helper function like `select()`.
 */
@mix(WithNavigation, WithStyling, WithPseudoClasses, WithPseudoElements, WithSelecting)
export class SelectorBuilder<T extends string> extends CoreBuilder<Tokenize<T>> {
  /**
   * Combine a selector with the previous one using a comma (`,`) to create a group of selectors.
   *
   * To join two selectors, use the `join` method instead.
   *
   * @example
   * ```ts
   * select('.btn').and('.link').style({ color: 'blue' });
   * // Results in the CSS: `.btn, .link { color: blue; }`
   * ```
   */
  public and<TSelector extends ValidSelector>(selector: TSelector) {
    const selectorTokens = tokenizeSelector(selector);

    return new SelectorBuilder<`${T}, ${TSelector}`>(
      [...this.context, { type: 'comma', content: ',' }, ...selectorTokens] as never,
      this.postcssContainer,
      this.postcssRoot,
    );
  }

  /**
   * Combine the current selector with another selector to create a combined selector.
   *
   * We currently DO NOT validate the order of selectors here.
   * Passing, for example, an `html` type selector after a class selector will yeild invalid CSS without an error!
   *
   * To create a group of selectors, use the `and` method instead.
   *
   * @example
   * ```ts
   * select('.btn').join('.link').style({ color: 'blue' });
   * // Results in the CSS: `.btn.link { color: blue; }`
   * ```
   */
  public join<TSelector extends ValidSelector>(selector: TSelector) {
    const selectorTokens = tokenizeSelector(selector);

    return new SelectorBuilder<`${T} ${TSelector}`>(
      [...this.context, ...selectorTokens] as never,
      this.postcssContainer,
      this.postcssRoot,
    );
  }
}
