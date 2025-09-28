import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import surimi from 'vite-plugin-surimi';

export default defineConfig(() => {
  return {
    plugins: [
      surimi({
        include: ['src/**/*.{js,ts,html}'],
        devFeatures: true,
        mode: 'manual',
      }),
      analyzer({
        analyzerMode: 'static',
        summary: true,
      }),
    ],
  };
});
