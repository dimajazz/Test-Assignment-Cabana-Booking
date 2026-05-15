import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    resolve: {
      alias: {
        '@api': path.resolve(__dirname, 'src/api'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@ui': path.resolve(__dirname, 'src/ui'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@models': path.resolve(__dirname, 'src/models'),
        '@constants': path.resolve(__dirname, 'src/constants'),
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/tests/setup.ts',
      include: ['src/tests/**/*.test.ts'],
      exclude: [...configDefaults.exclude, 'e2e/**', 'tests/**'],
      coverage: {
        provider: 'v8',
        exclude: [
          '**/*.css',
          '**/*.module.css'
        ]
      }
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev
          ? '[local]__[name]__[hash:base64:5]' // dev
          : '[hash:base64:8]'                  // prod
      }
    },
  };
});
