/** Jest config for SQLite integration tests only. Run with: npm run test:integration */
module.exports = {
  testMatch: ['**/__tests__/integration/sqlite/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/postgres/',
    'setupTestDb.ts'
  ],
  testEnvironment: 'node',
  testTimeout: 15000
}