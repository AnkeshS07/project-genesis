export type ProviderKind = 'ai' | 'storage' | 'search';

/** Reserved vendor names — types only in M6; no concrete implementations. */
export type AiProviderName =
  | 'not-implemented'
  | 'gemini'
  | 'openrouter'
  | 'groq'
  | 'openai'
  | 'anthropic'
  | 'azure-openai'
  | 'bedrock'
  | 'ollama';

export type StorageProviderName =
  'not-implemented' | 'r2' | 's3' | 'minio' | 'azure-blob' | 'gcs' | 'local';

export type SearchProviderName = 'not-implemented' | 'meilisearch' | 'elasticsearch' | 'typesense';

export type ProviderHealthStatus = {
  readonly status: 'up' | 'down' | 'unknown';
  readonly message?: string;
  readonly checkedAt: string;
};

/**
 * Optional selection keys (not required in env validation).
 * Missing / unknown values resolve to not-implemented in M6.
 */
export type ProviderSelectionConfig = {
  readonly ai?: AiProviderName | string;
  readonly storage?: StorageProviderName | string;
  readonly search?: SearchProviderName | string;
};
