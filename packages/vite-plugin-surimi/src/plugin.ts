import { readFile } from 'fs/promises';
import { pathToFileURL } from 'url';
import { createFilter } from '@rollup/pluginutils';
import fastGlob from 'fast-glob';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';

import type { SurimiPluginOptions } from './types.js';

const VIRTUAL_MODULE_ID = 'virtual:surimi.css';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

function isSurimiFile(code: string): boolean {
  return (
    code.includes("from 'surimi'") ||
    code.includes('from "surimi"') ||
    code.includes('s.select(') ||
    code.includes('surimi.')
  );
}

export function surimiPlugin(options: SurimiPluginOptions = {}): Plugin {
  const {
    include = ['src/**/*.{js,ts,jsx,tsx,vue,svelte}'],
    exclude = ['node_modules/**', '**/*.d.ts'],
    devFeatures = true,
    autoExternal = true,
    mode = 'manual',
  } = options;

  const filter = createFilter(include, exclude);
  let root: string;
  let lastCSS = '';

  return {
    name: 'vite-plugin-surimi',

    config(config, { command }) {
      // Automatically externalize surimi and postcss in build mode
      if (command === 'build' && autoExternal) {
        config.build = config.build ?? {};
        config.build.rollupOptions = config.build.rollupOptions ?? {};

        const existingExternal = config.build.rollupOptions.external ?? [];

        // Handle different types of external configuration
        let externalArray: string[] = [];
        if (Array.isArray(existingExternal)) {
          externalArray = [...existingExternal.filter((ext): ext is string => typeof ext === 'string')];
        } else if (typeof existingExternal === 'string') {
          externalArray = [existingExternal];
        }

        // Add surimi and postcss to externals if not already present
        const surimiExternals = ['surimi', 'postcss'];
        for (const ext of surimiExternals) {
          if (!externalArray.includes(ext)) {
            externalArray.push(ext);
          }
        }

        config.build.rollupOptions.external = externalArray;
      }
    },

    configResolved(config: ResolvedConfig) {
      root = config.root;
    },

    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    async load(id: string) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        if (mode === 'virtual') {
          const css = await generateCSS(root, filter);
          lastCSS = css;
          return css;
        }
        return '';
      }
    },

    async transform(code: string, id: string) {
      const normalizedId = normalizePath(id);

      // Only process files that contain surimi code
      if (!isSurimiFile(code)) return null;

      // In all modes, we need to prevent surimi runtime execution during build
      if (mode === 'manual' || mode === 'auto') {
        // Extract CSS at build time
        const css = await extractCssFromFile(id);

        if (css) {
          // Replace the surimi file with just a CSS injection
          // This eliminates the surimi runtime calls from the bundle
          return {
            code: `// CSS extracted from ${normalizedId} at build time
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  const styleId = 'surimi-${id.replace(/[^a-zA-Z0-9]/g, '-')}';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
  }
}`,
            map: null,
          };
        }

        // If no CSS was extracted, return empty module
        return {
          code: '// Surimi file processed at build time - no runtime needed',
          map: null,
        };
      }

      return null;
    },

    async handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
      if (!devFeatures || !filter(file)) {
        return;
      }

      // Regenerate CSS when files change
      const newCSS = await generateCSS(root, filter);

      if (newCSS !== lastCSS) {
        lastCSS = newCSS;

        // Update the virtual module
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (module) {
          await server.reloadModule(module);
        }
      }

      return [];
    },
  };
}

async function generateCSS(root: string, filter: (id: string) => boolean): Promise<string> {
  // Find all files matching our patterns
  const files = await fastGlob(['**/*.{js,ts,jsx,tsx}'], {
    cwd: root,
    absolute: true,
  });

  const filteredFiles = files.filter((file: string) => filter(normalizePath(file)));
  let allCss = '';

  for (const file of filteredFiles) {
    try {
      const content = await readFile(file, 'utf-8');

      // Check if file uses surimi
      if (content.includes("from 'surimi'") || content.includes('from "surimi"') || content.includes('s.select(')) {
        const css = await extractCssFromFile(file);
        if (css) {
          allCss += css + '\n';
        }
      }
    } catch (error) {
      console.warn(`Failed to process file ${file}:`, error);
    }
  }

  return allCss.trim();
}

async function extractCssFromFile(filePath: string): Promise<string> {
  try {
    // Convert file path to file URL for dynamic import
    const fileUrl = pathToFileURL(filePath).href;

    // Clear any existing Surimi styles before importing
    const { default: s } = await import('surimi');
    s.clear();

    // Import and execute the file
    await import(`${fileUrl}?t=${Date.now().toString()}`);

    // Get the generated CSS
    const css = s.build();

    // Clear again to avoid contamination between files
    s.clear();

    return css;
  } catch (error) {
    console.warn(`Failed to extract CSS from ${filePath}:`, error);
    return '';
  }
}

// Export the plugin as default
export default surimiPlugin;
