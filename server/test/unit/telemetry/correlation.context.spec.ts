import {
  getCorrelationId,
  getRequestId,
  runWithCorrelation,
} from '../../../src/telemetry/correlation/correlation.context';

describe('correlation context', () => {
  it('should_isolate_request_context_per_run', () => {
    runWithCorrelation({ service: 'api', requestId: 'a', correlationId: 'ca' }, () => {
      expect(getRequestId()).toBe('a');
      expect(getCorrelationId()).toBe('ca');
    });

    runWithCorrelation({ service: 'api', requestId: 'b', correlationId: 'cb' }, () => {
      expect(getRequestId()).toBe('b');
      expect(getCorrelationId()).toBe('cb');
    });

    expect(getRequestId()).toBeUndefined();
  });

  it('should_not_leak_context_after_run_completes', () => {
    runWithCorrelation({ service: 'worker', jobId: '1', correlationId: 'c1' }, () => {
      expect(getCorrelationId()).toBe('c1');
    });
    expect(getCorrelationId()).toBeUndefined();
  });
});
