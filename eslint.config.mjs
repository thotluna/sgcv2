import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
  globalIgnores([
    '.turbo/**',
    'node_modules/**',
    '**/node_modules/**',
    '**/dist/**',
    'playwright-report/**'
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.jest }
    },
    plugins: {
      prettier: prettierPlugin
    },
    ignores: ['**/*.json'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none'
        }
      ]
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    ignores: ['**/*.json']
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: 'tsconfig.base.json' },
      globals: {}
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-console': 'error',
      indent: ['error', 2]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' }
  },
  prettierConfig
])
