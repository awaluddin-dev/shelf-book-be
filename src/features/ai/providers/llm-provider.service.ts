import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

@Injectable()
export class LlmProviderService {
  private readonly logger = new Logger(LlmProviderService.name);

  constructor(private readonly config: ConfigService) {}

  private getProviders(): LlmProvider[] {
    const providers: LlmProvider[] = [];

    // Primary: Gemini via OpenAI-compatible endpoint
    const geminiKey = this.config.get<string>('GEMINI_API_KEY');
    if (geminiKey) {
      providers.push({
        name: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
        apiKey: geminiKey,
        model: 'gemini-3.6-flash',
      });
    }

    // Fallback: Groq (free tier, fast)
    const groqKey = this.config.get<string>('GROQ_API_KEY');
    if (groqKey) {
      providers.push({
        name: 'groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        apiKey: groqKey,
        model: 'llama-3.3-70b-versatile',
      });
    }

    return providers;
  }

  /**
   * Returns a native fetch Response with SSE stream from the first healthy provider.
   * Caller is responsible for piping this to the HTTP response.
   */
  async streamCompletion(
    messages: LlmMessage[],
    maxTokens: number = 800,
  ): Promise<Response> {
    const providers = this.getProviders();

    if (providers.length === 0) {
      throw new Error(
        'No LLM providers configured. Set GEMINI_API_KEY or GROQ_API_KEY.',
      );
    }

    for (const provider of providers) {
      try {
        this.logger.log(`Attempting LLM provider: ${provider.name}`);

        const response = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model: provider.model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: maxTokens,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.warn(
            `Provider ${provider.name} returned ${response.status}: ${errorText}`,
          );
          continue;
        }

        this.logger.log(`Streaming from provider: ${provider.name}`);
        return response;
      } catch (error) {
        this.logger.warn(
          `Provider ${provider.name} failed: ${(error as Error).message}`,
        );
        continue;
      }
    }

    throw new Error(
      'All LLM providers failed. Check your API keys and connectivity.',
    );
  }
}
