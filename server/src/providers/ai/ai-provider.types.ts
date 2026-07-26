export type AiMessageRole = 'system' | 'user' | 'assistant';

export type AiMessage = {
  readonly role: AiMessageRole;
  readonly content: string;
};

export type AiModelDescriptor = {
  readonly id: string;
  readonly displayName?: string;
  readonly capabilities?: readonly string[];
};

export type AiProviderCapabilities = {
  readonly textGeneration: boolean;
  readonly imageGeneration: boolean;
  readonly imageEditing: boolean;
  readonly vision: boolean;
  readonly embeddings: boolean;
  readonly structuredOutput: boolean;
  readonly functionCalling: boolean;
  readonly streaming: boolean;
};

export type AiUsageMetadata = {
  readonly provider: string;
  readonly model?: string;
  readonly promptTokens?: number;
  readonly completionTokens?: number;
  readonly latencyMs?: number;
  readonly requestId?: string;
  readonly estimatedCost?: number;
  readonly raw?: Readonly<Record<string, unknown>>;
};

export type AiTextRequest = {
  readonly model?: string;
  readonly systemPrompt?: string;
  readonly prompt?: string;
  readonly messages?: readonly AiMessage[];
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly timeoutMs?: number;
  readonly correlationId?: string;
};

export type AiTextResponse = {
  readonly text: string;
  readonly usage: AiUsageMetadata;
};

export type AiStructuredRequest = AiTextRequest & {
  readonly schemaName?: string;
};

export type AiStructuredResponse<T> = {
  readonly data: T;
  readonly usage: AiUsageMetadata;
};

export type AiImageRequest = {
  readonly model?: string;
  readonly prompt: string;
  readonly size?: string;
  readonly correlationId?: string;
};

export type AiImageEditRequest = {
  readonly model?: string;
  readonly prompt: string;
  readonly image: Buffer | Uint8Array;
  readonly mask?: Buffer | Uint8Array;
  readonly correlationId?: string;
};

export type AiImageResponse = {
  readonly images: readonly {
    readonly url?: string;
    readonly bytes?: Buffer | Uint8Array;
    readonly mimeType?: string;
  }[];
  readonly usage: AiUsageMetadata;
};

export type AiEmbedRequest = {
  readonly model?: string;
  readonly input: string | readonly string[];
  readonly correlationId?: string;
};

export type AiEmbedResponse = {
  readonly embeddings: readonly (readonly number[])[];
  readonly usage: AiUsageMetadata;
};
