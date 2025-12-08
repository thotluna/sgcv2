import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: {
          // Configuración específica para tests
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: 'node',
          resolveJsonModule: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    // Path aliases del backend
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    // Shared package - IMPORTANTE: mapear al código TypeScript fuente
    '^@sgcv2/shared/?(.*)$': '<rootDir>/../packages/shared/src/$1',
    '^@sgcv2/shared$': '<rootDir>/../packages/shared/src/index.ts',
  },
  // CRÍTICO: No ignorar el paquete shared para que ts-jest lo transpile
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  // Configuración de coverage
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'src/config',
    'src/generated',
    'src/app.ts',
    'src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
};

export default config;
