import { NotImplementedAiProvider } from '../../../src/providers/ai/not-implemented-ai.provider';
import { ProviderNotImplementedError } from '../../../src/providers/errors/provider-not-implemented.error';

describe('NotImplementedAiProvider', () => {
  const provider = new NotImplementedAiProvider();

  it('should_report_all_capabilities_disabled', () => {
    const caps = provider.getCapabilities();
    expect(caps.textGeneration).toBe(false);
    expect(caps.streaming).toBe(false);
  });

  it('should_throw_not_implemented_on_generateText', async () => {
    await expect(provider.generateText()).rejects.toBeInstanceOf(ProviderNotImplementedError);
    await expect(provider.generateText()).rejects.toThrow(/Not Implemented/);
  });
});
