export type ProviderErrorCode =
  'NOT_IMPLEMENTED' | 'UNAVAILABLE' | 'INVALID_REQUEST' | 'PROVIDER_ERROR';

/**
 * Base error for all provider-layer failures.
 * Business services should catch this type — not vendor SDK errors.
 */
export class ProviderError extends Error {
  public readonly code: ProviderErrorCode;
  public readonly providerKind: string;
  public readonly operation: string;

  constructor(
    message: string,
    options: {
      code: ProviderErrorCode;
      providerKind: string;
      operation: string;
      cause?: unknown;
    },
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'ProviderError';
    this.code = options.code;
    this.providerKind = options.providerKind;
    this.operation = options.operation;
  }
}
