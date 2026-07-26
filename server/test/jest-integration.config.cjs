const shared = require('./jest.shared.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...shared,
  displayName: 'server-integration',
  testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
};
