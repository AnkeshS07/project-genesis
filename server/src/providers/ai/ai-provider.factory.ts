import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AiProvider, AiProviderFactory } from './ai-provider.interface';
import { NotImplementedAiProvider } from './not-implemented-ai.provider';

/**
 * Selects an AI provider by name. M6 always returns the NotImplemented placeholder.
 */
@Injectable()
export class DefaultAiProviderFactory implements AiProviderFactory {
  private readonly placeholder = new NotImplementedAiProvider();

  constructor(private readonly config: ConfigService) {}

  create(name?: string): AiProvider {
    // Concrete vendors are deferred — any selection maps to the placeholder in M6.
    void (name ?? this.config.get<string>('AI_PROVIDER') ?? 'not-implemented');
    return this.placeholder;
  }

  getDefault(): AiProvider {
    return this.create();
  }
}
