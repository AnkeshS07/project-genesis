const shared = require('./jest.shared.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...shared,
  displayName: 'server-unit',
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/telemetry/logging/**/*.ts',
    'src/telemetry/correlation/correlation.context.ts',
    'src/telemetry/metrics/**/*.ts',
    'src/telemetry/tracing/**/*.ts',
    'src/telemetry/audit/**/*.ts',
    'src/telemetry/process/process-error.handlers.ts',
    'src/telemetry/telemetry.constants.ts',
    'src/common/filters/**/*.ts',
    'src/config/env.validation.ts',
    'src/providers/ai/not-implemented-ai.provider.ts',
    'src/providers/errors/**/*.ts',
    'src/workers/infrastructure.processor.ts',
    'src/workers/worker-log.context.ts',
    'src/jobs/job.registry.ts',
    'src/jobs/jobs.constants.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
};
