/** @type {import('jest').Config} */
module.exports = {
  displayName: 'web-unit',
  rootDir: '..',
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts', '<rootDir>/test/unit/**/*.spec.tsx'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        jsx: 'react-jsx',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@project-genesis/sdk$': '<rootDir>/../../packages/sdk/src/index.ts',
    '^@project-genesis/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@project-genesis/shared$': '<rootDir>/../../packages/shared/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup-unit.ts'],
  collectCoverageFrom: [
    'app/(marketing)/page.tsx',
    'features/auth/**/*.ts',
    'lib/api-client.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
  clearMocks: true,
};
