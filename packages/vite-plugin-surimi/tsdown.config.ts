import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'node',
  target: 'node20',
  clean: true,
  dts: true,
  // Keep external dependencies external for a plugin
  external: ['vite', 'surimi', 'postcss'],
});
