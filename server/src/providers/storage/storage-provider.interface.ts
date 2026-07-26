import type { ProviderHealthStatus } from '../types/provider.types';
import type {
  StorageBatchOperation,
  StorageBatchResult,
  StorageDownloadResult,
  StorageListInput,
  StorageListResult,
  StorageMetadataPatch,
  StorageObjectMetadata,
  StorageSignedUrlInput,
  StorageSignedUrlResult,
  StorageUploadInput,
} from './storage-provider.types';

/**
 * Replaceable object-storage provider contract (Architecture 1.1).
 * Concrete backends (R2, S3, MinIO, …) are added in later epics.
 */
export interface StorageProvider {
  readonly name: string;

  upload(input: StorageUploadInput): Promise<StorageObjectMetadata>;

  download(key: string): Promise<StorageDownloadResult>;

  delete(key: string): Promise<void>;

  move(fromKey: string, toKey: string): Promise<StorageObjectMetadata>;

  copy(fromKey: string, toKey: string): Promise<StorageObjectMetadata>;

  exists(key: string): Promise<boolean>;

  getSignedUrl(input: StorageSignedUrlInput): Promise<StorageSignedUrlResult>;

  listObjects(input: StorageListInput): Promise<StorageListResult>;

  getMetadata(key: string): Promise<StorageObjectMetadata>;

  updateMetadata(key: string, metadata: StorageMetadataPatch): Promise<StorageObjectMetadata>;

  batch?(ops: readonly StorageBatchOperation[]): Promise<StorageBatchResult>;

  healthCheck(): Promise<ProviderHealthStatus>;
}

export interface StorageProviderFactory {
  create(name?: string): StorageProvider;
  getDefault(): StorageProvider;
}
