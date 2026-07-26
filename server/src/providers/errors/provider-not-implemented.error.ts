import { ProviderError } from './provider.error';

/**
 * Thrown by M6 placeholder providers. Message always includes "Not Implemented".
 */
export class ProviderNotImplementedError extends ProviderError {
  constructor(providerKind: string, operation: string) {
    super(`${providerKind} provider operation "${operation}" is Not Implemented`, {
      code: 'NOT_IMPLEMENTED',
      providerKind,
      operation,
    });
    this.name = 'ProviderNotImplementedError';
  }
}

export function notImplemented(providerKind: string, operation: string): never {
  throw new ProviderNotImplementedError(providerKind, operation);
}
