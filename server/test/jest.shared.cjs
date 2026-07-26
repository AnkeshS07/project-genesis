/**
 * Shared Jest defaults for @project-genesis/server test projects.
 * Unit / API / integration configs extend this for consistency.
 * @type {import('jest').Config}
 */
module.exports = {
  rootDir: '..',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@tests/(.*)$': '<rootDir>/../tests/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup-unit.ts'],
  clearMocks: true,
};
