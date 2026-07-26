import { Injectable } from '@nestjs/common';
import type { AiProvider, AiProviderFactory } from './ai/ai-provider.interface';
import type { SearchProvider, SearchProviderFactory } from './search/search-provider.interface';
import type { StorageProvider, StorageProviderFactory } from './storage/storage-provider.interface';
import type { ProviderKind } from './types/provider.types';

/**
 * Central resolver for provider kinds.
 * Business layers should prefer injecting AI_PROVIDER / STORAGE_PROVIDER / SEARCH_PROVIDER,
 * or use this registry when a name must be chosen dynamically.
 */
@Injectable()
export class ProviderRegistry {
  constructor(
    private readonly aiFactory: AiProviderFactory,
    private readonly storageFactory: StorageProviderFactory,
    private readonly searchFactory: SearchProviderFactory,
  ) {}

  getAi(name?: string): AiProvider {
    return this.aiFactory.create(name);
  }

  getStorage(name?: string): StorageProvider {
    return this.storageFactory.create(name);
  }

  getSearch(name?: string): SearchProvider {
    return this.searchFactory.create(name);
  }

  list(kind: ProviderKind): readonly string[] {
    // M6: only the placeholder is registered.
    void kind;
    return ['not-implemented'];
  }
}
