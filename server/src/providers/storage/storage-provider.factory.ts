import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotImplementedStorageProvider } from './not-implemented-storage.provider';
import type { StorageProvider, StorageProviderFactory } from './storage-provider.interface';

/**
 * Selects a storage provider by name. M6 always returns the NotImplemented placeholder.
 */
@Injectable()
export class DefaultStorageProviderFactory implements StorageProviderFactory {
  private readonly placeholder = new NotImplementedStorageProvider();

  constructor(private readonly config: ConfigService) {}

  create(name?: string): StorageProvider {
    void (name ?? this.config.get<string>('STORAGE_PROVIDER') ?? 'not-implemented');
    return this.placeholder;
  }

  getDefault(): StorageProvider {
    return this.create();
  }
}
