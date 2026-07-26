/**
 * DI tokens for the provider abstraction layer (Epic 00 / M6).
 * Business services will inject these tokens — never concrete vendor SDKs.
 */
export const AI_PROVIDER = Symbol('AI_PROVIDER');
export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');
export const SEARCH_PROVIDER = Symbol('SEARCH_PROVIDER');

export const AI_PROVIDER_FACTORY = Symbol('AI_PROVIDER_FACTORY');
export const STORAGE_PROVIDER_FACTORY = Symbol('STORAGE_PROVIDER_FACTORY');
export const SEARCH_PROVIDER_FACTORY = Symbol('SEARCH_PROVIDER_FACTORY');

export const PROVIDER_REGISTRY = Symbol('PROVIDER_REGISTRY');
