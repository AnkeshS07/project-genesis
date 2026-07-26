import { InfrastructureProcessor } from '../../../src/workers/infrastructure.processor';
import { INFRA_METRIC_NAMES } from '../../../src/telemetry/telemetry.constants';
import { createInfrastructureJobStub } from '../../../../tests/factories/job.factory';
import { createAppLoggerMock } from '../../../../tests/mocks/logger.mock';
import { createMetricsMock } from '../../../../tests/mocks/metrics.mock';

/**
 * Worker processor unit tests — Redis/BullMQ-free.
 * Uses job stubs + Metrics/Logger port mocks only (no Queue/Worker/ioredis).
 */
describe('InfrastructureProcessor', () => {
  it('should_refuse_jobs_and_increment_failure_metric_without_redis', async () => {
    const appLogger = createAppLoggerMock();
    const metrics = createMetricsMock();
    const processor = new InfrastructureProcessor(appLogger as never, metrics);
    const handler = processor.create();
    const job = createInfrastructureJobStub({
      name: 'system.ping',
      queueName: 'system',
      id: 'job-42',
    });

    await expect(handler(job as never)).rejects.toThrow(/Not Implemented/);

    expect(metrics.increment).toHaveBeenCalledWith(
      INFRA_METRIC_NAMES.WORKER_JOBS_FAILED_TOTAL,
      1,
      expect.objectContaining({
        queue: 'system',
        jobName: 'system.ping',
        reason: 'not_implemented',
      }),
    );
    expect(appLogger.warn).toHaveBeenCalled();
  });
});
