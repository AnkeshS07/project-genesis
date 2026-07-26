const shared = require('./jest.shared.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...shared,
  displayName: 'server-api',
  testMatch: ['<rootDir>/test/api/**/*.spec.ts'],
};
