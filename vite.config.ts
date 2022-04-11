import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
  build: {
    target: 'ESNext',
    lib: {
      entry: fileURLToPath(new URL('src/index.ts', import.meta.url)),
      name: 'reactivity',
      fileName: format => `reactivity.${format}.js`,
    },
  },
});
