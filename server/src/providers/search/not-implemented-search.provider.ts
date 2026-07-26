import { Injectable } from '@nestjs/common';
import { notImplemented } from '../errors/provider-not-implemented.error';
import type { ProviderHealthStatus } from '../types/provider.types';
import type { SearchProvider } from './search-provider.interface';
import type { SearchResultPage, SearchSuggestion } from './search-provider.types';

/**
 * M6 placeholder — no search engine client, no HTTP, no secrets.
 */
@Injectable()
export class NotImplementedSearchProvider implements SearchProvider {
  public readonly name = 'not-implemented';

  async index(): Promise<void> {
    return notImplemented('search', 'index');
  }

  async indexMany(): Promise<void> {
    return notImplemented('search', 'indexMany');
  }

  async update(): Promise<void> {
    return notImplemented('search', 'update');
  }

  async delete(): Promise<void> {
    return notImplemented('search', 'delete');
  }

  async search(): Promise<SearchResultPage> {
    return notImplemented('search', 'search');
  }

  async suggest(): Promise<readonly SearchSuggestion[]> {
    return notImplemented('search', 'suggest');
  }

  async reindex(): Promise<void> {
    return notImplemented('search', 'reindex');
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    return {
      status: 'unknown',
      message: 'Search provider is Not Implemented',
      checkedAt: new Date().toISOString(),
    };
  }
}
