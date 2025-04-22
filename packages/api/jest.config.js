module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
}
