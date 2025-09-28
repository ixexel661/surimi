import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import surimi from 'vite-plugin-surimi';

export default defineConfig(() => {
  return {
    plugins: [
      surimi({
        mode: 'virtual', // Use virtual CSS imports and auto-discovery of CSS files
      }),
      analyzer({
        analyzerMode: 'static',
        summary: true,
      }),
    ],
  };
});
