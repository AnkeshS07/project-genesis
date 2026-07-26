import { Injectable } from '@nestjs/common';
import { notImplemented } from '../errors/provider-not-implemented.error';
import type { ProviderHealthStatus } from '../types/provider.types';
import type { StorageProvider } from './storage-provider.interface';
import type {
  StorageBatchResult,
  StorageDownloadResult,
  StorageListResult,
  StorageObjectMetadata,
  StorageSignedUrlResult,
} from './storage-provider.types';

/**
 * M6 placeholder — no SDKs, no HTTP, no secrets.
 */
@Injectable()
export class NotImplementedStorageProvider implements StorageProvider {
  public readonly name = 'not-implemented';

  async upload(): Promise<StorageObjectMetadata> {
    return notImplemented('storage', 'upload');
  }

  async download(): Promise<StorageDownloadResult> {
    return notImplemented('storage', 'download');
  }

  async delete(): Promise<void> {
    return notImplemented('storage', 'delete');
  }

  async move(): Promise<StorageObjectMetadata> {
    return notImplemented('storage', 'move');
  }

  async copy(): Promise<StorageObjectMetadata> {
    return notImplemented('storage', 'copy');
  }

  async exists(): Promise<boolean> {
    return notImplemented('storage', 'exists');
  }

  async getSignedUrl(): Promise<StorageSignedUrlResult> {
    return notImplemented('storage', 'getSignedUrl');
  }

  async listObjects(): Promise<StorageListResult> {
    return notImplemented('storage', 'listObjects');
  }

  async getMetadata(): Promise<StorageObjectMetadata> {
    return notImplemented('storage', 'getMetadata');
  }

  async updateMetadata(): Promise<StorageObjectMetadata> {
    return notImplemented('storage', 'updateMetadata');
  }

  async batch(): Promise<StorageBatchResult> {
    return notImplemented('storage', 'batch');
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    return {
      status: 'unknown',
      message: 'Storage provider is Not Implemented',
      checkedAt: new Date().toISOString(),
    };
  }
}
