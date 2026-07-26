import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotImplementedSearchProvider } from './not-implemented-search.provider';
import type { SearchProvider, SearchProviderFactory } from './search-provider.interface';

/**
 * Selects a search provider by name. M6 always returns the NotImplemented placeholder.
 */
@Injectable()
export class DefaultSearchProviderFactory implements SearchProviderFactory {
  private readonly placeholder = new NotImplementedSearchProvider();

  constructor(private readonly config: ConfigService) {}

  create(name?: string): SearchProvider {
    void (name ?? this.config.get<string>('SEARCH_PROVIDER') ?? 'not-implemented');
    return this.placeholder;
  }

  getDefault(): SearchProvider {
    return this.create();
  }
}
