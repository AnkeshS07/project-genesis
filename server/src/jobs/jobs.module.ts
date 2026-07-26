import { Module } from '@nestjs/common';
import { JOB_REGISTRY } from '../queues/queues.constants';
import { JobRegistry } from './job.registry';

@Module({
  providers: [
    {
      provide: JOB_REGISTRY,
      useClass: JobRegistry,
    },
  ],
  exports: [JOB_REGISTRY],
})
export class JobsModule {}
