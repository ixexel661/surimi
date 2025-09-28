import { resolve } from 'path';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'node',
  target: 'node20',
  clean: true,
  dts: true,
  // External dependencies that should not be bundled
  external: ['postcss'],
  // Rolldown-specific options for better optimization and alias resolution
  rolldownOptions: {
    resolve: {
      alias: {
        '#builder': resolve('./src/builder.ts'),
        '#css-generator': resolve('./src/css-generator.ts'),
        '#stylesheet': resolve('./src/stylesheet.ts'),
        '#types': resolve('./src/types.ts'),
      },
    },
    output: {
      // Don't preserve modules to help with deduplication
      preserveModules: false,
    },
  },
});
