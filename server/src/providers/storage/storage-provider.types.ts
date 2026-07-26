export type StorageObjectMetadata = {
  readonly key: string;
  readonly filename?: string;
  readonly contentType?: string;
  readonly size?: number;
  readonly checksum?: string;
  readonly version?: string;
  readonly workspaceId?: string;
  readonly projectId?: string;
  readonly ownerId?: string;
  readonly provider: string;
  readonly region?: string;
  readonly encryption?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly custom?: Readonly<Record<string, string>>;
};

export type StorageUploadInput = {
  readonly key: string;
  readonly body: Buffer | Uint8Array;
  readonly contentType?: string;
  readonly filename?: string;
  readonly metadata?: Readonly<Record<string, string>>;
};

export type StorageDownloadResult = {
  readonly key: string;
  readonly body: Buffer;
  readonly contentType?: string;
  readonly metadata?: StorageObjectMetadata;
};

export type StorageSignedUrlInput = {
  readonly key: string;
  readonly expiresInSeconds: number;
  readonly method?: 'GET' | 'PUT';
  readonly contentType?: string;
};

export type StorageSignedUrlResult = {
  readonly url: string;
  readonly expiresAt: string;
};

export type StorageListInput = {
  readonly prefix?: string;
  readonly cursor?: string;
  readonly limit?: number;
};

export type StorageListResult = {
  readonly objects: readonly StorageObjectMetadata[];
  readonly nextCursor?: string;
};

export type StorageMetadataPatch = Readonly<Record<string, string>>;

export type StorageBatchOperation =
  | { readonly type: 'delete'; readonly key: string }
  | { readonly type: 'copy'; readonly fromKey: string; readonly toKey: string };

export type StorageBatchResult = {
  readonly succeeded: number;
  readonly failed: number;
  readonly errors?: readonly { readonly key: string; readonly message: string }[];
};
