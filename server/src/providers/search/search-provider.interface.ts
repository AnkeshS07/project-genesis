import type { ProviderHealthStatus } from '../types/provider.types';
import type {
  SearchDocument,
  SearchQuery,
  SearchReindexOptions,
  SearchResultPage,
  SearchSuggestQuery,
  SearchSuggestion,
} from './search-provider.types';

/**
 * Search *engine* adapter (Architecture 1.1).
 * Ranking, ACL filtering, and SearchService live outside this interface.
 */
export interface SearchProvider {
  readonly name: string;

  index(document: SearchDocument): Promise<void>;

  indexMany(documents: readonly SearchDocument[]): Promise<void>;

  update(document: SearchDocument): Promise<void>;

  delete(id: string, options?: { index?: string }): Promise<void>;

  search(query: SearchQuery): Promise<SearchResultPage>;

  suggest?(query: SearchSuggestQuery): Promise<readonly SearchSuggestion[]>;

  reindex?(options?: SearchReindexOptions): Promise<void>;

  healthCheck(): Promise<ProviderHealthStatus>;
}

export interface SearchProviderFactory {
  create(name?: string): SearchProvider;
  getDefault(): SearchProvider;
}
