import { parseDurationToMs, parseDurationToSeconds } from '../../../src/auth/duration.util';

describe('duration.util', () => {
  it('should_parse_common_jwt_durations', () => {
    expect(parseDurationToSeconds('15m')).toBe(900);
    expect(parseDurationToSeconds('7d')).toBe(604_800);
    expect(parseDurationToMs('1h')).toBe(3_600_000);
  });

  it('should_reject_invalid_duration', () => {
    expect(() => parseDurationToSeconds('nope')).toThrow(/Invalid duration/);
  });
});
