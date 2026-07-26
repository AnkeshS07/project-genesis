import { Injectable } from '@nestjs/common';
import { notImplemented } from '../errors/provider-not-implemented.error';
import type { ProviderHealthStatus } from '../types/provider.types';
import type { AiProvider } from './ai-provider.interface';
import type {
  AiEmbedResponse,
  AiImageResponse,
  AiModelDescriptor,
  AiProviderCapabilities,
  AiStructuredResponse,
  AiTextResponse,
} from './ai-provider.types';

/**
 * M6 placeholder — no SDKs, no HTTP, no secrets.
 * Every operation throws ProviderNotImplementedError ("Not Implemented").
 */
@Injectable()
export class NotImplementedAiProvider implements AiProvider {
  public readonly name = 'not-implemented';

  getCapabilities(): AiProviderCapabilities {
    return {
      textGeneration: false,
      imageGeneration: false,
      imageEditing: false,
      vision: false,
      embeddings: false,
      structuredOutput: false,
      functionCalling: false,
      streaming: false,
    };
  }

  async listModels(): Promise<readonly AiModelDescriptor[]> {
    return notImplemented('ai', 'listModels');
  }

  async generateText(): Promise<AiTextResponse> {
    return notImplemented('ai', 'generateText');
  }

  async generateStructured<T>(): Promise<AiStructuredResponse<T>> {
    return notImplemented('ai', 'generateStructured');
  }

  async generateImage(): Promise<AiImageResponse> {
    return notImplemented('ai', 'generateImage');
  }

  async editImage(): Promise<AiImageResponse> {
    return notImplemented('ai', 'editImage');
  }

  async embed(): Promise<AiEmbedResponse> {
    return notImplemented('ai', 'embed');
  }

  async healthCheck(): Promise<ProviderHealthStatus> {
    return {
      status: 'unknown',
      message: 'AI provider is Not Implemented',
      checkedAt: new Date().toISOString(),
    };
  }
}
