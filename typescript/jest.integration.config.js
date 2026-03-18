/** Jest config for SQLite integration tests only. Run with: npm run test:integration */
module.exports = {
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/postgres/'],
  forceExit: true,
  testTimeout: 15000,
}
