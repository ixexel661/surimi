import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import surimiPlugin from 'vite-plugin-surimi';

export default defineConfig(() => {
  return {
    plugins: [
      surimiPlugin({ inlineCss: true }),
      analyzer({
        analyzerMode: 'static',
        summary: true,
      }),
    ],
  };
});
