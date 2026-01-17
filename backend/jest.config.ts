import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.test.json',
  //     isolatedModules: true,
  //   },
  // },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    // Path aliases del backend
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@users/(.*)$': '<rootDir>/src/modules/users/$1',
    '^@consts/(.*)$': '<rootDir>/src/consts/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    // CRÍTICO: Mapear al código FUENTE de shared
    '^@sgcv2/shared$': '<rootDir>/../packages/shared/src/index.ts',
    '^@sgcv2/shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
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
