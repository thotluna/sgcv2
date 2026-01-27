import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

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
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Framework: packages starting with `react` or `next`
            ["^react", "^next"],
            // 2. Externals: everything else
            ["^@?\\w"],
            // 3. Shared/Monorepo
            ["^@sgcv2/shared"],
            // 4. Aliases Internos (@/)
            ["^@/"],
            // 5. Features (@feature/)
            ["^@feature/"],
            // 6. Relatives
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // 7. Styles
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
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
