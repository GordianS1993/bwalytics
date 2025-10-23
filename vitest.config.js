import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Environment
    environment: 'jsdom',
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'archive/',
        '*.config.js',
      ],
    },
    
    // Test Files
    include: ['tests/**/*.test.js'],
    
    // Globals (optional, macht describe/it/expect global verfügbar)
    globals: true,
  },
});
