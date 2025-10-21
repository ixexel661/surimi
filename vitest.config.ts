import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    projects: [
      {
        test: {
          name: 'surimi',
          include: ['./packages/surimi/test/**/*.spec.ts'],
        },
      },
      {
        test: {
          name: 'selector-parser',
          include: ['./packages/selector-parser/test/**/*.spec.ts'],
          typecheck: {
            enabled: true,
            include: ['./packages/selector-parser/test/**/*.spec-d.ts'],
          },
        },
      },
      {
        test: {
          name: 'vite-plugin-surimi',
          include: ['./packages/vite-plugin-surimi/test/**/*.spec.ts'],
        },
      },
    ],
    reporters: [['verbose', { summary: true }]],
    coverage: {
      provider: 'v8',
    },
  },
});
