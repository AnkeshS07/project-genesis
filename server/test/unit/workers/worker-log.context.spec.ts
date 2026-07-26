import {
  getCorrelation,
  runWithCorrelation,
} from '../../../src/telemetry/correlation/correlation.context';
import { runWithWorkerJobContext } from '../../../src/workers/worker-log.context';
import { createInfrastructureJobStub } from '../../../../tests/factories/job.factory';

describe('runWithWorkerJobContext', () => {
  it('should_bind_worker_job_fields_into_als', () => {
    const job = createInfrastructureJobStub({
      id: '99',
      name: 'system.ping',
      queueName: 'default',
      correlationId: 'corr-job',
    });

    runWithWorkerJobContext(job as never, () => {
      expect(getCorrelation()).toMatchObject({
        service: 'worker',
        jobId: '99',
        jobName: 'system.ping',
        queueName: 'default',
        correlationId: 'corr-job',
      });
    });

    expect(getCorrelation()).toBeUndefined();
  });

  it('should_not_nest_leak_into_outer_api_context', () => {
    runWithCorrelation({ service: 'api', requestId: 'outer' }, () => {
      const job = createInfrastructureJobStub({ id: 'inner' });
      runWithWorkerJobContext(job as never, () => {
        expect(getCorrelation()?.service).toBe('worker');
      });
      expect(getCorrelation()?.requestId).toBe('outer');
    });
  });
});
