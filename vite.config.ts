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
    lib: {
      entry: fileURLToPath(new URL('src/main.ts', import.meta.url)),
      name: 'reactivity',
      fileName: format => `reactivity.${format}.js`,
    },
  },
});
