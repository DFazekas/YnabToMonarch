import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'netlify/**',
        'public/**',
        'tests/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/test-*.js'
      ]
    }
  },
  assetsInclude: ['**/*.html']
});
