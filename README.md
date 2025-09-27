# Surimi 🍥

TypeScript-based CSS query builder that uses scripts like:

```typescript
select('.container').style({ display: 'flex' });
select('.container').media('(min-width: 600px)').style({ flexDirection: 'row' });
```

to generate CSS files with **zero runtime overhead** - CSS generation happens at build time.

## Features & Roadmap

### Phase 1: Core Foundation 🎯

- [ ] **Basic Selector & Style Application**
  - [ ] `select('.class')`, `select('#id')`, `select('element')` - Basic CSS selectors
  - [ ] `.style({ property: 'value' })` - Apply CSS properties with full TypeScript validation
  - [ ] Type-safe CSS properties using `csstype` library
  - [ ] CSS output generation using PostCSS AST

- [ ] **Basic Pseudo-classes**
  - [ ] `.hover()` - `:hover` pseudo-class
  - [ ] `.focus()` - `:focus` pseudo-class
  - [ ] `.active()` - `:active` pseudo-class
  - [ ] `.disabled()` - `:disabled` pseudo-class

- [ ] **Basic Pseudo-elements**
  - [ ] `.before()` - `::before` pseudo-element
  - [ ] `.after()` - `::after` pseudo-element

- [ ] **Simple Media Queries**
  - [ ] `.media('(min-width: 768px)')` - Basic media query support

- [ ] **Basic Selector Relationships**
  - [ ] `.child('selector')` - Direct child combinator (`>`)
  - [ ] `.descendant('selector')` - Descendant combinator (space)

### Phase 2: Enhanced Selectors 🔧

- [ ] **Complex Selector Combinations**
  - [ ] `.and('.class')` - Multiple class selector (`.btn.primary`)
  - [ ] `.not('.class')` - Negation pseudo-class (`:not()`)
  - [ ] `.adjacent('selector')` - Adjacent sibling combinator (`+`)
  - [ ] `.sibling('selector')` - General sibling combinator (`~`)

- [ ] **Attribute Selectors**
  - [ ] `.attr('name', 'value')` - Exact attribute match (`[attr="value"]`)
  - [ ] `.attr('name', 'value', 'starts')` - Starts with (`[attr^="value"]`)
  - [ ] `.attr('name', 'value', 'ends')` - Ends with (`[attr$="value"]`)
  - [ ] `.attr('name', 'value', 'contains')` - Contains (`[attr*="value"]`)

- [ ] **Advanced Pseudo-selectors**
  - [ ] `.nthChild(n)` - `:nth-child(n)` selector
  - [ ] `.nthChild('odd'|'even')` - `:nth-child(odd/even)` selector
  - [ ] `.firstChild()` - `:first-child` selector
  - [ ] `.lastChild()` - `:last-child` selector
  - [ ] `.nthOfType(n)` - `:nth-of-type(n)` selector

- [ ] **Enhanced Navigation**
  - [ ] `.parent()` - Navigate back to parent selector
  - [ ] `.root()` - Navigate back to root selector
  - [ ] Complex nesting with proper CSS generation

### Phase 3: Advanced Features 🚀

- [ ] **CSS Custom Properties (Variables)**
  - [ ] `property('--name', 'default-value')` - Define CSS custom properties
  - [ ] Use properties in `.style()` calls with TypeScript validation
  - [ ] `.define({ [property]: 'value' })` - Define property values in scope

- [ ] **Mixins & Reusable Styles**
  - [ ] `mixin({ styles })` - Define reusable style objects
  - [ ] `.apply(mixinName)` - Apply mixin to selector
  - [ ] Mixin composition and extension

- [ ] **Advanced Media Features**
  - [ ] Complex media query combinations
  - [ ] Media query nesting and scoping
  - [ ] Print media support
  - [ ] Container queries (future CSS feature)

- [ ] **Keyframe Animations**
  - [ ] `keyframes('name', { stages })` - Define keyframe animations
  - [ ] Reference keyframes in animation properties
  - [ ] Animation composition and timing

- [ ] **Advanced Selector Features**
  - [ ] Custom pseudo-class support
  - [ ] Complex selector parsing and validation
  - [ ] Selector specificity calculation
  - [ ] CSS selector optimization

### Phase 4: Build System Integration 🔄

- [ ] **Compilation & Optimization**
  - [ ] CSS deduplication and minification
  - [ ] Dead code elimination for unused styles
  - [ ] Source map generation for debugging
  - [ ] CSS chunking and code splitting

- [ ] **Framework Integration**
  - [ ] Vite plugin for seamless development
  - [ ] Webpack loader support
  - [ ] Next.js integration
  - [ ] Build-time CSS extraction

- [ ] **Developer Experience**
  - [ ] VS Code extension for syntax highlighting
  - [ ] Runtime development warnings
  - [ ] CSS preview and inspection tools
  - [ ] Performance profiling and optimization hints

## Design Principles

- **Zero Runtime Overhead**: All CSS generation happens at build time
- **Type Safety**: Full TypeScript validation for CSS properties and values
- **Ergonomic API**: Fluent, chainable interface inspired by SQL builders
- **Standards Compliant**: Generates valid, optimized CSS
- **Extensible**: Plugin architecture for custom functionality
