import { createHash } from 'node:crypto';
import path from 'node:path';
import { createFilter } from '@rollup/pluginutils';
import compile from '@surimi/compiler';
import type { PluginContext } from 'rollup';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';

import type { SurimiOptions } from './types.js';

/**
 * Main plugin function that selects between build and dev modes
 */
export default function surimiPlugin(options: SurimiOptions = {}): Plugin[] {
  const { include = ['**/*.css.{ts,js}'], exclude = ['node_modules/**', '**/*.d.ts'], inlineCss = false } = options;
  const filter = createFilter(include, exclude);

  let resolvedConfig: ResolvedConfig | undefined;
  let isBuild: boolean | undefined;
  let server: ViteDevServer | undefined;

  // Build cache for production builds
  const buildCache = new Map<string, { css: string; js: string; cssFileId: string | undefined }>();

  // Dependency mapping: dependency file -> Set of CSS files that depend on it
  const dependencyMap = new Map<string, Set<string>>();

  // Helper function to invalidate modules for HMR
  function invalidateModule(absoluteId: string) {
    if (!server) return;

    const { moduleGraph } = server;
    const modules = moduleGraph.getModulesByFile(absoluteId);

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module);
        // Set timestamp for HMR
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now();
      }
    }
  }

  // Helper function to register dependency relationships and watch files for HMR
  function registerDependencies(cssFile: string, watchFiles: string[], context: PluginContext) {
    for (const file of watchFiles) {
      if (
        typeof file === 'string' &&
        !file.includes('node_modules') &&
        !file.startsWith('rolldown:') &&
        normalizePath(file) !== normalizePath(cssFile)
      ) {
        context.addWatchFile(file);

        const normalizedFile = normalizePath(file);
        if (!dependencyMap.has(normalizedFile)) {
          dependencyMap.set(normalizedFile, new Set());
        }
        const dependencySet = dependencyMap.get(normalizedFile);
        if (dependencySet) {
          dependencySet.add(normalizePath(cssFile));
        }
      }
    }
  }

  return [
    {
      name: 'vite-plugin-surimi',
      config() {
        return {
          build: {
            rollupOptions: {
              external: ['rolldown:runtime', 'surimi'],
            },
          },
        };
      },
      configResolved(config) {
        resolvedConfig = config;
        isBuild = config.command === 'build' && !config.build.watch;
      },
    },
    {
      name: 'vite-plugin-surimi:dev',
      configureServer(_server) {
        server = _server;
      },
      handleHotUpdate(ctx) {
        if (!server || isBuild) return;

        const { file } = ctx;
        const normalizedFile = normalizePath(file);

        // Check if this file has dependents (CSS files that import it)
        const dependentCssFiles = dependencyMap.get(normalizedFile);

        if (dependentCssFiles && dependentCssFiles.size > 0) {
          // Invalidate all dependent CSS files
          for (const cssFile of dependentCssFiles) {
            invalidateModule(cssFile);
          }

          // Let Vite handle the standard HMR for the changed file itself
          return ctx.modules;
        }

        // If this is a CSS file itself, let it update normally
        if (filter(normalizedFile)) {
          return ctx.modules;
        }

        // For other files, use default HMR behavior
        return ctx.modules;
      },
      async transform(_, id) {
        if (isBuild) return null;

        if (filter(id)) {
          try {
            // Compile the CSS-in-JS file
            const { css, js, watchFiles } = await compile({
              inputPath: normalizePath(id),
              cwd: resolvedConfig?.root ?? process.cwd(),
              include,
              exclude,
            });

            // Register dependencies for HMR tracking
            if (Array.isArray(watchFiles)) {
              registerDependencies(id, [...watchFiles, id], this);
            }

            const inliningSnippet = injectCssChunk(css, id, true);

            // Return JavaScript that injects the CSS directly
            const jsCode = `${js}\n\n${inliningSnippet}`;

            return jsCode;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.error(`Failed to compile Surimi file ${id}: ${message}`);
          }
        }

        return null;
      },
    },
    {
      name: 'vite-plugin-surimi:build',
      async transform(_, id) {
        if (!isBuild) return null;

        if (filter(id)) {
          try {
            const { css, js, cssFileId } = await (async () => {
              if (!buildCache.has(id)) {
                const compileResult = await compile({
                  inputPath: normalizePath(id),
                  cwd: resolvedConfig?.root ?? process.cwd(),
                  include,
                  exclude,
                });

                if (inlineCss) {
                  return { css: compileResult.css, js: compileResult.js, cssFileId: undefined };
                }

                const cssFileName = path.basename(id, '.css');

                // Emit the CSS as an asset
                const cssFileId = this.emitFile({
                  type: 'asset',
                  fileName: cssFileName,
                  source: compileResult.css,
                });

                buildCache.set(id, { css: compileResult.css, js: compileResult.js, cssFileId });
              }

              const cacheEntry = buildCache.get(id);

              if (!cacheEntry) throw new Error('Unexpected missing cache entry');

              return cacheEntry;
            })();

            let jsCode: string;

            if (inlineCss) {
              const inliningSnippet = injectCssChunk(css, id);

              jsCode = `${js}\n\n${inliningSnippet}`;
            } else {
              if (cssFileId === undefined) throw new Error('CSS file ID was undefined while not in inline mode');

              // Asset mode - import CSS file
              jsCode = `${js}\n\nimport "./${this.getFileName(cssFileId)}";`;
            }

            return jsCode;
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.error(`Failed to compile Surimi file ${id}: ${message}`);
          }
        }

        return null;
      },
    },
  ];
}

export function injectCssChunk(css: string, id: string, hmr = false): string {
  const identifier = path.basename(id);
  const chunkHash = createHash('md5').update(id).digest('hex').slice(0, 8);
  const styleId = `surimi-style_${identifier}_${chunkHash}`;

  let injectionString = `
// Auto-generated by vite-plugin-surimi (build mode - inline)
const css = ${JSON.stringify(css)};
const styleId = '${styleId}';

// Create and inject new style element
const styleElement = document.createElement('style');
styleElement.id = styleId;
styleElement.textContent = css;
document.head.appendChild(styleElement);
`;

  if (hmr) {
    injectionString += `
// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // The new version will be loaded automatically
  });
  
  import.meta.hot.dispose(() => {
    // Clean up when module is disposed
    const style = document.getElementById(styleId);
    if (style) {
      style.remove();
    }
  });
}`;
  }

  return injectionString;
}
