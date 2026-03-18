/** Jest config for PostgreSQL integration tests (Testcontainers). Run with: npm run test:integration:postgres */
module.exports = {
  testMatch: ['**/__tests__/integration/postgres/**/*.postgres.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  forceExit: true,
  testTimeout: 120000,
}
