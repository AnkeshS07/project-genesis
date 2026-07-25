import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @ApiOperation({ summary: 'Overall health probe including MongoDB and Redis (unversioned)' })
  async getHealth() {
    return this.healthService.getHealth();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness probe — 200 only when MongoDB and Redis are up (unversioned)',
  })
  async getReady(@Res({ passthrough: true }) res: Response) {
    const payload = await this.healthService.getReady();
    if (payload.data.status !== 'ok') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return payload;
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe — process only, no dependency checks (unversioned)' })
  getLive() {
    return this.healthService.getLive();
  }
}
