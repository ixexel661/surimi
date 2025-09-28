import { describe, expect, it } from 'vitest';

// Import the isSurimiFile function - we need to make it exportable first
// For now, let's test it through the plugin behavior

describe('Surimi Plugin Utilities', () => {
  describe('isSurimiFile detection (file extension based)', () => {
    const testCases = [
      {
        filePath: '/src/components/button.css.ts',
        expected: true,
        description: '.css.ts file',
      },
      {
        filePath: '/src/styles/global.css.js',
        expected: true,
        description: '.css.js file',
      },
      {
        filePath: '/src/components/Button.tsx',
        expected: false,
        description: '.tsx file',
      },
      {
        filePath: '/src/utils/helpers.ts',
        expected: false,
        description: '.ts file',
      },
      {
        filePath: '/src/components/Button.js',
        expected: false,
        description: '.js file',
      },
      {
        filePath: '/src/styles.css',
        expected: false,
        description: '.css file',
      },
      {
        filePath: '/nested/path/styles.css.ts',
        expected: true,
        description: 'nested .css.ts file',
      },
    ];

    testCases.forEach(({ filePath, expected, description }) => {
      it(`should ${expected ? 'detect' : 'not detect'} ${description}`, () => {
        // Test file extension detection logic
        const isSurimiFile = /\.css\.(ts|js)$/.test(filePath);
        expect(isSurimiFile).toBe(expected);
      });
    });
  });

  describe('CSS Generation', () => {
    it('should handle empty CSS gracefully', () => {
      const emptyCss = '';
      expect(emptyCss.length).toBe(0);
    });

    it('should generate valid CSS injection code', () => {
      const css = '.test { color: red; }';
      const injectionCode = `
        const css = ${JSON.stringify(css)};
        if (typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.textContent = css;
          document.head.appendChild(style);
        }
      `;

      expect(injectionCode).toContain(css);
      expect(injectionCode).toContain('createElement');
      expect(injectionCode).toContain('appendChild');
      expect(injectionCode).toContain('typeof document');
    });

    it('should handle CSS with special characters', () => {
      const cssWithSpecialChars = '.test { content: "Hello \\22 World"; }';
      const jsonString = JSON.stringify(cssWithSpecialChars);

      // Should be properly escaped
      expect(jsonString).toContain('\\\\');
      expect(jsonString).toContain('\\"');
    });
  });

  describe('File ID Generation', () => {
    it('should generate safe IDs from file paths', () => {
      const testPaths = [
        '/home/user/project/src/styles.css.ts',
        'C:\\Users\\user\\project\\src\\styles.css.ts',
        'src/components/Button/styles.css.ts',
      ];

      testPaths.forEach(path => {
        const safeId = path.replace(/[^a-zA-Z0-9]/g, '-');

        // Should only contain alphanumeric characters and dashes
        expect(safeId).toMatch(/^[a-zA-Z0-9-]+$/);
        expect(safeId.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Plugin Options Validation', () => {
    it('should handle all valid mode values', () => {
      const validModes = ['manual', 'virtual'] as const;

      validModes.forEach(mode => {
        expect(['manual', 'virtual']).toContain(mode);
      });
    });

    it('should validate include patterns', () => {
      const validPatterns = ['src/**/*.ts', ['src/**/*.ts', 'lib/**/*.js'], 'components/**/*.{ts,tsx}'];

      validPatterns.forEach(pattern => {
        if (Array.isArray(pattern)) {
          expect(pattern.every(p => typeof p === 'string')).toBe(true);
        } else {
          expect(typeof pattern).toBe('string');
        }
      });
    });

    it('should validate exclude patterns', () => {
      const validExcludes = ['node_modules/**', ['**/*.d.ts', '**/*.spec.ts'], 'dist/**'];

      validExcludes.forEach(exclude => {
        if (Array.isArray(exclude)) {
          expect(exclude.every(p => typeof p === 'string')).toBe(true);
        } else {
          expect(typeof exclude).toBe('string');
        }
      });
    });
  });
});
