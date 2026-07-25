import type { HealthStatus } from '@project-genesis/types';

export interface ApiClientOptions {
  readonly baseUrl: string;
}

/**
 * HTTP SDK placeholder. Real NestJS API methods are added in later epics.
 * This stub does not perform network I/O.
 */
export class ApiClient {
  public constructor(private readonly options: ApiClientOptions) {}

  public getBaseUrl(): string {
    return this.options.baseUrl;
  }

  public async getHealthPlaceholder(): Promise<HealthStatus> {
    return { status: 'ok' };
  }
}
