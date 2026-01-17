import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  nextVitals,
  nextTs,
  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    'node_modules/**',
    'dist/**',
    '.swc/**',
    'coverage/**',
    '**/*.config.js',
    '**/*.config.ts',
    '**/__tests__/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.spec.tsx',
    'playwright-report/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: {
            unknown: 'Do not use unknown, use specific types or interfaces instead.',
          },
        },
      ],
    },
  },
]);

export default eslintConfig;
