import { describe, expect, it } from 'vitest';

import { select } from './index';

describe('Core functionality', () => {
  describe('Basic Selector & Style Application', () => {
    describe('Basic CSS Selectors', () => {
      it('should support class selectors', () => {
        const result = select('.container').style({ display: 'flex' });

        expect(result.build()).toBe('.container {\n    display: flex;\n}');
      });

      it('should support ID selectors', () => {
        const result = select('#header').style({ backgroundColor: 'blue' });

        expect(result.build()).toBe('#header {\n    background-color: blue;\n}');
      });

      it('should support element selectors', () => {
        const result = select('button').style({ border: 'none' });

        expect(result.build()).toBe('button {\n    border: none;\n}');
      });

      it('should support multiple selectors as arguments', () => {
        const result = select('.container', '.wrapper').style({ padding: '1rem' });

        expect(result.build()).toBe('.container, .wrapper {\n    padding: 1rem;\n}');
      });

      it('should support CSS selector strings with multiple selectors', () => {
        const result = select('.container, .outer, html').style({ boxSizing: 'border-box' });

        expect(result.build()).toBe('.container, .outer, html {\n    box-sizing: border-box;\n}');
      });
    });

    describe('CSS Properties with TypeScript Validation', () => {
      it('should support basic CSS properties', () => {
        const result = select('.box').style({
          width: '100px',
          height: '100px',
          margin: '0 auto',
        });

        expect(result.build()).toBe('.box {\n    width: 100px;\n    height: 100px;\n    margin: 0 auto;\n}');
      });

      it('should support flexbox properties', () => {
        const result = select('.flex-container').style({
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'stretch',
        });

        expect(result.build()).toBe(
          '.flex-container {\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: stretch;\n}',
        );
      });

      it('should support grid properties', () => {
        const result = select('.grid-container').style({
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        });

        expect(result.build()).toBe(
          '.grid-container {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1rem;\n}',
        );
      });

      it('should support color properties', () => {
        const result = select('.colorful').style({
          color: '#333',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          borderColor: 'hsl(120, 50%, 50%)',
        });

        expect(result.build()).toBe(
          '.colorful {\n    color: #333;\n    background-color: rgba(255, 0, 0, 0.5);\n    border-color: hsl(120, 50%, 50%);\n}',
        );
      });
    });
  });

  describe('Basic Pseudo-classes', () => {
    it('should support :hover pseudo-class', () => {
      const result = select('.button').hover().style({ backgroundColor: 'lightgray' });

      expect(result.build()).toBe('.button:hover {\n    background-color: lightgray;\n}');
    });

    it('should support :focus pseudo-class', () => {
      const result = select('.input').focus().style({ outline: '2px solid blue' });

      expect(result.build()).toBe('.input:focus {\n    outline: 2px solid blue;\n}');
    });

    it('should support :active pseudo-class', () => {
      const result = select('.link').active().style({ color: 'red' });

      expect(result.build()).toBe('.link:active {\n    color: red;\n}');
    });

    it('should support :disabled pseudo-class', () => {
      const result = select('.button').disabled().style({ opacity: 0.5 });

      expect(result.build()).toBe('.button:disabled {\n    opacity: 0.5;\n}');
    });

    it('should chain multiple pseudo-classes', () => {
      const result = select('.button').hover().focus().style({
        backgroundColor: 'blue',
        outline: 'none',
      });

      expect(result.build()).toBe('.button:hover:focus {\n    background-color: blue;\n    outline: none;\n}');
    });
  });

  describe('Basic Pseudo-elements', () => {
    it('should support ::before pseudo-element', () => {
      const result = select('.text').before().style({ content: '"→"' });

      expect(result.build()).toBe('.text::before {\n    content: "→";\n}');
    });

    it('should support ::after pseudo-element', () => {
      const result = select('.text').after().style({
        content: '""',
        display: 'block',
      });

      expect(result.build()).toBe('.text::after {\n    content: "";\n    display: block;\n}');
    });
  });

  describe('Simple Media Queries', () => {
    it('should support basic media queries', () => {
      const result = select('.container').media('(min-width: 768px)').style({
        flexDirection: 'row',
      });

      expect(result.build()).toBe(
        '@media (min-width: 768px) {\n    .container {\n        flex-direction: row;\n    }\n}',
      );
    });

    it('should support max-width media queries', () => {
      const result = select('.mobile-nav').media('(max-width: 767px)').style({
        display: 'block',
      });

      expect(result.build()).toBe('@media (max-width: 767px) {\n    .mobile-nav {\n        display: block;\n    }\n}');
    });

    it('should support complex media query conditions', () => {
      const result = select('.tablet-layout').media('(min-width: 768px) and (max-width: 1024px)').style({
        columns: 2,
      });

      expect(result.build()).toBe(
        '@media (min-width: 768px) and (max-width: 1024px) {\n    .tablet-layout {\n        columns: 2;\n    }\n}',
      );
    });

    it('should support print media queries', () => {
      const result = select('.no-print').media('print').style({
        display: 'none',
      });

      expect(result.build()).toBe('@media print {\n    .no-print {\n        display: none;\n    }\n}');
    });
  });

  describe('Basic Selector Relationships', () => {
    it('should support direct child combinator', () => {
      const result = select('.card').child('.title').style({ fontSize: '1.2em' });

      expect(result.build()).toBe('.card > .title {\n    font-size: 1.2em;\n}');
    });

    it('should support descendant combinator', () => {
      const result = select('.nav').descendant('a').style({ textDecoration: 'none' });

      expect(result.build()).toBe('.nav a {\n    text-decoration: none;\n}');
    });

    it('should support multiple child relationships', () => {
      const result = select('.sidebar').child('.menu').child('.item').style({
        padding: '0.5rem',
      });

      expect(result.build()).toBe('.sidebar > .menu > .item {\n    padding: 0.5rem;\n}');
    });

    it('should support mixed relationships', () => {
      const result = select('.main').descendant('.section').child('.header').style({
        fontWeight: 'bold',
      });

      expect(result.build()).toBe('.main .section > .header {\n    font-weight: bold;\n}');
    });
  });

  describe('Method Chaining and Complex Combinations', () => {
    it('should combine basic selectors with pseudo-classes and media queries', () => {
      const result = select('.button').hover().media('(min-width: 768px)').style({
        backgroundColor: 'blue',
        padding: '1rem 2rem',
      });

      expect(result.build()).toBe(
        '@media (min-width: 768px) {\n    .button:hover {\n        background-color: blue;\n        padding: 1rem 2rem;\n    }\n}',
      );
    });

    it('should handle complex selector chains', () => {
      const result = select('.nav').child('.item').hover().child('a').style({ color: 'white' });

      expect(result.build()).toBe('.nav > .item:hover > a {\n    color: white;\n}');
    });

    it('should support multiple style applications on the same selector', () => {
      const selector = select('.multi-style');
      selector.style({ display: 'flex' });
      selector.hover().style({ backgroundColor: 'gray' });
      selector.media('(max-width: 768px)').style({ flexDirection: 'column' });

      console.log(selector.build());

      expect(selector.build()).toBe(
        '.multi-style {\n    display: flex;\n}\n\n' +
          '.multi-style:hover {\n    background-color: gray;\n}\n\n' +
          '@media (max-width: 768px) {\n    .multi-style {\n        flex-direction: column;\n    }\n}',
      );
    });
  });

  describe('CSS Output Generation', () => {
    it('should handle empty styles gracefully', () => {
      const result = select('.empty').style({});

      expect(result.build()).toBe('.empty {\n}');
    });

    it('should preserve CSS property order', () => {
      const result = select('.ordered').style({
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 1000,
      });

      expect(result.build()).toBe(
        '.ordered {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 1000;\n}',
      );
    });

    it('should handle numeric values correctly', () => {
      const result = select('.numeric').style({
        opacity: 0.5,
        zIndex: 100,
        flexGrow: 1,
        order: -1,
      });

      expect(result.build()).toBe(
        '.numeric {\n    opacity: 0.5;\n    z-index: 100;\n    flex-grow: 1;\n    order: -1;\n}',
      );
    });

    it('should handle vendor-prefixed properties', () => {
      const result = select('.prefixed').style({
        WebkitTransform: 'scale(1.1)',
        MozTransform: 'scale(1.1)',
        transform: 'scale(1.1)',
      });

      expect(result.build()).toBe(
        '.prefixed {\n    -webkit-transform: scale(1.1);\n    -moz-transform: scale(1.1);\n    transform: scale(1.1);\n}',
      );
    });
  });
});
