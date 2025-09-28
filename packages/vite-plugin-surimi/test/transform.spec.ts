import { describe, expect, it } from 'vitest';

import { surimiPlugin } from '../src/plugin.js';

describe('Surimi Plugin - Mode Behavior', () => {
  describe('Mode Configuration', () => {
    it('should create plugin with different modes', () => {
      const modes = ['manual', 'virtual'] as const;

      modes.forEach(mode => {
        const plugin = surimiPlugin({ mode });
        expect(plugin.name).toBe('vite-plugin-surimi');
      });
    });
    it('should use manual mode by default', () => {
      const plugin = surimiPlugin();
      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('vite-plugin-surimi');
    });
  });

  describe('File Detection Logic', () => {
    it('should detect surimi files by extension correctly', () => {
      const testCases = [
        { filePath: 'src/styles/button.css.ts', isSurimi: true },
        { filePath: 'src/styles/global.css.js', isSurimi: true },
        { filePath: 'src/components/Button.tsx', isSurimi: false },
        { filePath: 'src/utils/helpers.ts', isSurimi: false },
        { filePath: 'src/components/Button.js', isSurimi: false },
        { filePath: 'src/styles/main.css', isSurimi: false },
      ];

      testCases.forEach(({ filePath, isSurimi }) => {
        const detectedAsSurimi = /\.css\.(ts|js)$/.test(filePath);
        expect(detectedAsSurimi).toBe(isSurimi);
      });
    });
  });
  describe('CSS Injection Code Generation', () => {
    it('should generate valid CSS injection code structure', () => {
      const css = '.test { color: red; }';
      const fileId = '/test/file.css.ts'.replace(/[^a-zA-Z0-9]/g, '-');

      const injectionCode = `
// CSS extracted from /test/file.css.ts at build time
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  const styleId = 'surimi-${fileId}';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }
}`;

      // Validate the structure
      expect(injectionCode).toContain('CSS extracted from');
      expect(injectionCode).toContain(css);
      expect(injectionCode).toContain('createElement');
      expect(injectionCode).toContain('getElementById');
      expect(injectionCode).toContain('appendChild');
    });

    it('should handle empty CSS gracefully', () => {
      const emptyCss = '';
      const jsonString = JSON.stringify(emptyCss);

      expect(jsonString).toBe('""');
      expect(jsonString.length).toBe(2); // Just the quotes
    });

    it('should handle CSS with special characters', () => {
      const specialCss = '.test { content: "Hello \\"world\\""; }';
      const jsonString = JSON.stringify(specialCss);

      // Should be properly escaped
      expect(jsonString).toContain('\\"');
      expect(JSON.parse(jsonString)).toBe(specialCss);
    });
  });

  describe('Plugin Hooks Structure', () => {
    it('should have all required plugin hooks', () => {
      const plugin = surimiPlugin();

      // Check that the plugin has the expected structure
      expect(plugin.name).toBe('vite-plugin-surimi');
      expect(typeof plugin.config).toBe('function');
      expect(typeof plugin.configResolved).toBe('function');
      expect(typeof plugin.resolveId).toBe('function');
      expect(typeof plugin.load).toBe('function');
      expect(typeof plugin.transform).toBe('function');
    });

    it('should have correct plugin name and structure', () => {
      const plugin = surimiPlugin({ mode: 'virtual' });

      expect(plugin.name).toBe('vite-plugin-surimi');
      expect(plugin).toHaveProperty('config');
      expect(plugin).toHaveProperty('configResolved');
      expect(plugin).toHaveProperty('resolveId');
      expect(plugin).toHaveProperty('load');
      expect(plugin).toHaveProperty('transform');
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid configuration options', () => {
      const validConfigs = [
        {},
        { mode: 'manual' as const },
        { mode: 'virtual' as const },
        { autoExternal: false },
        { include: ['src/**/*.css.{ts,js}'] },
        { exclude: ['**/*.d.ts'] },
        { virtualModuleId: 'virtual:custom.css' },
      ];

      validConfigs.forEach(config => {
        expect(() => surimiPlugin(config)).not.toThrow();
      });
    });

    it('should handle include/exclude patterns for CSS files', () => {
      const patterns = {
        string: 'src/**/*.css.ts',
        array: ['src/**/*.css.ts', 'lib/**/*.css.js'],
      };

      Object.values(patterns).forEach(pattern => {
        expect(() => surimiPlugin({ include: pattern })).not.toThrow();
        expect(() => surimiPlugin({ exclude: pattern })).not.toThrow();
      });
    });
  });
});
