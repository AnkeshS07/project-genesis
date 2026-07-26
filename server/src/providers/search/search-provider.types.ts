export type SearchEntityType =
  'story' | 'chapter' | 'scene' | 'character' | 'world' | 'asset' | 'project' | string;

export type SearchDocument = {
  readonly id: string;
  readonly entityType: SearchEntityType;
  readonly workspaceId?: string;
  readonly projectId?: string;
  readonly title?: string;
  readonly body?: string;
  readonly tags?: readonly string[];
  readonly status?: string;
  readonly ownerId?: string;
  readonly softDeleted?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly fields?: Readonly<Record<string, unknown>>;
};

export type SearchFilters = {
  readonly workspaceId?: string;
  readonly projectId?: string;
  readonly entityTypes?: readonly SearchEntityType[];
  readonly tags?: readonly string[];
  readonly status?: string;
  readonly ownerId?: string;
  readonly includeSoftDeleted?: boolean;
  readonly dateFrom?: string;
  readonly dateTo?: string;
};

export type SearchQuery = {
  readonly q: string;
  readonly filters?: SearchFilters;
  readonly sort?: string;
  readonly page?: number;
  readonly cursor?: string;
  readonly pageSize?: number;
  readonly facets?: readonly string[];
};

export type SearchHit = {
  readonly id: string;
  readonly entityType: SearchEntityType;
  readonly score?: number;
  readonly document: SearchDocument;
  readonly highlights?: Readonly<Record<string, readonly string[]>>;
};

export type SearchResultPage = {
  readonly hits: readonly SearchHit[];
  readonly total: number;
  readonly page?: number;
  readonly pageSize?: number;
  readonly nextCursor?: string;
  readonly facets?: Readonly<Record<string, Readonly<Record<string, number>>>>;
};

export type SearchSuggestQuery = {
  readonly q: string;
  readonly limit?: number;
  readonly filters?: SearchFilters;
};

export type SearchSuggestion = {
  readonly text: string;
  readonly entityType?: SearchEntityType;
  readonly id?: string;
};

export type SearchReindexOptions = {
  readonly entityTypes?: readonly SearchEntityType[];
  readonly workspaceId?: string;
};
