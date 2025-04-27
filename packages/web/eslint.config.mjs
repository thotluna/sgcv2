import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  // Permitir require en archivos de setup de Jest
  {
    files: ['jest.setup.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'import/no-commonjs': 'off', // si usas eslint-plugin-import
      'global-require': 'off', // si usas eslint-plugin-node
    },
  },
]

export default eslintConfig
