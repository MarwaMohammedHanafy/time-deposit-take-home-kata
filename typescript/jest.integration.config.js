/** Jest config for integration tests only. Run with: jest --config jest.integration.config.js */
module.exports = {
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  forceExit: true,
  testTimeout: 15000,
}
