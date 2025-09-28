import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    projects: [
      {
        test: {
          name: 'unit',
          include: ['./packages/*/src/**/*.spec.ts', './packages/*/test/**/*.spec.ts'],
        },
      },
    ],
    reporters: [['verbose', { summary: true }]],
    coverage: {
      provider: 'v8',
    },
  },
});
