import { JobRegistry } from '../../../src/jobs/job.registry';
import { JOB_NAMES } from '../../../src/jobs/jobs.constants';

describe('JobRegistry', () => {
  it('should_list_only_unimplemented_infrastructure_jobs', () => {
    const registry = new JobRegistry();
    const jobs = registry.list();

    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.every((job) => job.implemented === false)).toBe(true);
    expect(registry.get(JOB_NAMES.SYSTEM_PING)?.implemented).toBe(false);
  });
});
