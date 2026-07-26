import { Injectable } from '@nestjs/common';
import { JOB_NAMES, type JobDefinition } from './jobs.constants';

/**
 * Catalog of known job types.
 * M7 lists infrastructure placeholders only; feature jobs arrive in later epics.
 */
@Injectable()
export class JobRegistry {
  private readonly definitions: readonly JobDefinition[] = [
    {
      name: JOB_NAMES.SYSTEM_PING,
      description: 'Infrastructure ping placeholder — not executed in M7',
      implemented: false,
    },
  ];

  list(): readonly JobDefinition[] {
    return this.definitions;
  }

  get(name: string): JobDefinition | undefined {
    return this.definitions.find((definition) => definition.name === name);
  }
}
