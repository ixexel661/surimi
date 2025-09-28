import { beforeEach, describe, expect, it } from 'vitest';

import s from '../../src/index';

describe('Media Queries', () => {
  beforeEach(() => {
    s.clear();
  });

  describe('Simple Media Queries', () => {
    it('should support basic media queries', () => {
      s.select('.container').media('(min-width: 768px)').style({
        flexDirection: 'row',
      });

      expect(s.build()).toBe(`\
@media (min-width: 768px) {
    .container {
        flex-direction: row
    }
}`);
    });

    it('should support max-width media queries', () => {
      s.select('.mobile-nav').media('(max-width: 767px)').style({
        display: 'block',
      });

      expect(s.build()).toBe(`\
@media (max-width: 767px) {
    .mobile-nav {
        display: block
    }
}`);
    });

    it('should support complex media query conditions', () => {
      s.select('.tablet-layout').media('(min-width: 768px) and (max-width: 1024px)').style({
        columns: 2,
      });

      expect(s.build()).toBe(`\
@media (min-width: 768px) and (max-width: 1024px) {
    .tablet-layout {
        columns: 2
    }
}`);
    });

    it('should support print media queries', () => {
      s.select('.no-print').media('print').style({
        display: 'none',
      });

      expect(s.build()).toBe(`\
@media print {
    .no-print {
        display: none
    }
}`);
    });
  });

  describe('Media Query Chaining', () => {
    it('should combine basic selectors with pseudo-classes and media queries', () => {
      s.select('.button').hover().media('(min-width: 768px)').style({ backgroundColor: 'blue' });

      expect(s.build()).toBe(`\
@media (min-width: 768px) {
    .button:hover {
        background-color: blue
    }
}`);
    });
  });
});
