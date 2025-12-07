import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  // IMPORTANTE: Deshabilita coverage por defecto
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'src/config',
    'src/generated',
    'src/app.ts',
    'src/server.ts',
  ],
};

export default config;
