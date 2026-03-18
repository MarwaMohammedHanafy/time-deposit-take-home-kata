/** Jest config for PostgreSQL integration tests */
module.exports = {
  testMatch: ['**/__tests__/integration/postgres/**/*.postgres.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    'setupPostgresTestDb.ts'
  ],
  testEnvironment: 'node',
  testTimeout: 120000
}