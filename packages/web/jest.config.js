/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  // Only pick up .test.ts and .test.tsx files under __tests__
  testMatch: ['**/__tests__/**/*.test.@(ts|tsx)'],
  testPathIgnorePatterns: ['/__tests__/page-objects/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl$': '<rootDir>/__mocks__/next-intl.ts',
    '^next-intl/(.*)$': '<rootDir>/__mocks__/next-intl.ts'
  },
  // Load environment config for React act support
  setupFiles: ['<rootDir>/jest.env.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
  },
  // Allow transforming next-intl ESM
  transformIgnorePatterns: ['node_modules/(?!next-intl)']
}
