/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Permite usar los alias de tsconfig
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  // Permite transformar uuid que es un módulo ESM
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  // Opcional: muestra cobertura
  collectCoverage: true,
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
