import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { JobsModule } from './jobs/jobs.module';
import { TELEMETRY_SERVICE_KIND } from './telemetry/telemetry.constants';
import { TelemetryModule } from './telemetry/telemetry.module';
import { WorkersModule } from './workers/workers.module';

/**
 * Root module for the NestJS worker process (Architecture 1.1).
 * No HTTP server, no controllers, no business processors.
 */
@Module({
  imports: [AppConfigModule, TelemetryModule, JobsModule, WorkersModule],
  providers: [{ provide: TELEMETRY_SERVICE_KIND, useValue: 'worker' }],
})
export class WorkerAppModule {}
