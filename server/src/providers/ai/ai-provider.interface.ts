import type { ProviderHealthStatus } from '../types/provider.types';
import type {
  AiEmbedRequest,
  AiEmbedResponse,
  AiImageEditRequest,
  AiImageRequest,
  AiImageResponse,
  AiModelDescriptor,
  AiProviderCapabilities,
  AiStructuredRequest,
  AiStructuredResponse,
  AiTextRequest,
  AiTextResponse,
} from './ai-provider.types';

/**
 * Replaceable AI provider contract (Architecture 1.1).
 * Concrete vendors (Gemini, OpenRouter, Groq, …) are added in later epics.
 */
export interface AiProvider {
  readonly name: string;

  getCapabilities(): AiProviderCapabilities;

  listModels(): Promise<readonly AiModelDescriptor[]>;

  generateText(request: AiTextRequest): Promise<AiTextResponse>;

  generateStructured<T>(request: AiStructuredRequest): Promise<AiStructuredResponse<T>>;

  generateImage(request: AiImageRequest): Promise<AiImageResponse>;

  editImage(request: AiImageEditRequest): Promise<AiImageResponse>;

  embed(request: AiEmbedRequest): Promise<AiEmbedResponse>;

  healthCheck(): Promise<ProviderHealthStatus>;
}

export interface AiProviderFactory {
  create(name?: string): AiProvider;
  getDefault(): AiProvider;
}
