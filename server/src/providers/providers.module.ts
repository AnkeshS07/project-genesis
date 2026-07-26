import { Global, Module } from '@nestjs/common';
import { DefaultAiProviderFactory } from './ai/ai-provider.factory';
import { NotImplementedAiProvider } from './ai/not-implemented-ai.provider';
import {
  AI_PROVIDER,
  AI_PROVIDER_FACTORY,
  PROVIDER_REGISTRY,
  SEARCH_PROVIDER,
  SEARCH_PROVIDER_FACTORY,
  STORAGE_PROVIDER,
  STORAGE_PROVIDER_FACTORY,
} from './providers.constants';
import { ProviderRegistry } from './provider-registry';
import { DefaultSearchProviderFactory } from './search/search-provider.factory';
import { NotImplementedSearchProvider } from './search/not-implemented-search.provider';
import { DefaultStorageProviderFactory } from './storage/storage-provider.factory';
import { NotImplementedStorageProvider } from './storage/not-implemented-storage.provider';
import type { AiProviderFactory } from './ai/ai-provider.interface';
import type { SearchProviderFactory } from './search/search-provider.interface';
import type { StorageProviderFactory } from './storage/storage-provider.interface';

/**
 * Provider abstraction layer (Epic 00 / M6).
 * Registers DI tokens for AI / Storage / Search — NotImplemented only.
 * Does not open HTTP connections or load vendor SDKs.
 */
@Global()
@Module({
  providers: [
    NotImplementedAiProvider,
    NotImplementedStorageProvider,
    NotImplementedSearchProvider,
    {
      provide: AI_PROVIDER_FACTORY,
      useClass: DefaultAiProviderFactory,
    },
    {
      provide: STORAGE_PROVIDER_FACTORY,
      useClass: DefaultStorageProviderFactory,
    },
    {
      provide: SEARCH_PROVIDER_FACTORY,
      useClass: DefaultSearchProviderFactory,
    },
    {
      provide: AI_PROVIDER,
      inject: [AI_PROVIDER_FACTORY],
      useFactory: (factory: AiProviderFactory) => factory.getDefault(),
    },
    {
      provide: STORAGE_PROVIDER,
      inject: [STORAGE_PROVIDER_FACTORY],
      useFactory: (factory: StorageProviderFactory) => factory.getDefault(),
    },
    {
      provide: SEARCH_PROVIDER,
      inject: [SEARCH_PROVIDER_FACTORY],
      useFactory: (factory: SearchProviderFactory) => factory.getDefault(),
    },
    {
      provide: PROVIDER_REGISTRY,
      inject: [AI_PROVIDER_FACTORY, STORAGE_PROVIDER_FACTORY, SEARCH_PROVIDER_FACTORY],
      useFactory: (
        aiFactory: AiProviderFactory,
        storageFactory: StorageProviderFactory,
        searchFactory: SearchProviderFactory,
      ) => new ProviderRegistry(aiFactory, storageFactory, searchFactory),
    },
  ],
  exports: [
    AI_PROVIDER,
    STORAGE_PROVIDER,
    SEARCH_PROVIDER,
    AI_PROVIDER_FACTORY,
    STORAGE_PROVIDER_FACTORY,
    SEARCH_PROVIDER_FACTORY,
    PROVIDER_REGISTRY,
  ],
})
export class ProvidersModule {}
