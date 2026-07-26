export function createAiProviderMock() {
  return {
    name: 'mock-ai',
    getCapabilities: jest.fn(() => ({
      textGeneration: false,
      imageGeneration: false,
      imageEditing: false,
      vision: false,
      embeddings: false,
      structuredOutput: false,
      functionCalling: false,
      streaming: false,
    })),
    listModels: jest.fn(),
    generateText: jest.fn(),
    generateStructured: jest.fn(),
    generateImage: jest.fn(),
    embed: jest.fn(),
    checkHealth: jest.fn(),
  };
}
