import { Injectable, Logger } from '@nestjs/common';
import { RagRetrievalService } from './rag-retrieval.service';
import {
  LlmMessage,
  LlmProviderService,
} from '../providers/llm-provider.service';
import { ChatDto } from './chat.dto';

// Contact page URL — shown when question is out of scope
const CONTACT_URL = 'https://awaluddin-dev.vercel.app/#contact';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly rag: RagRetrievalService,
    private readonly llm: LlmProviderService,
  ) {}

  async streamChat(dto: ChatDto): Promise<Response> {
    // Last user message is the current question
    const currentQuestion = dto.messages[dto.messages.length - 1].content;

    // Retrieve relevant context from DB
    const contextBlocks = await this.rag.retrieve(currentQuestion);

    const contextText =
      contextBlocks.length > 0
        ? contextBlocks
            .map((b) => `[${b.source.toUpperCase()}]\n${b.content}`)
            .join('\n\n')
        : 'NO_CONTEXT_FOUND';

    const systemPrompt = `You are an AI assistant embedded in Awaluddin's portfolio website.
Your ONLY job is to answer questions about Awaluddin — his experience, skills, projects, and availability.

CONTEXT FROM DATABASE:
${contextText}

STRICT RULES:
1. Answer ONLY based on the context provided above. Do not invent or assume anything not in the context.
2. If the context does not contain enough information to answer the question, respond with exactly:
   "I don't have that information. For specific questions, please reach out directly at ${CONTACT_URL}"
3. Keep answers concise — 2-4 sentences max unless the question genuinely requires more detail.
4. NO Markdown formatting. Plain prose only.
5. Do not answer questions unrelated to Awaluddin (no general coding help, no opinions, no world events).
6. If asked about salary expectations or availability, refer to the profile context and be specific.
7. Speak about Awaluddin in third person: "He has worked on...", "His experience includes..."
8. If NO_CONTEXT_FOUND: always redirect to contact, do not guess.`;

    // Build full message history with injected system context as first user turn
    const messages: LlmMessage[] = [
      { role: 'user', content: systemPrompt },
      {
        role: 'assistant',
        content:
          'Understood. I will answer in the same language the user uses, and only based on the provided context.',
      },
      // Inject prior conversation turns (only keep the last 4 to save tokens, excluding current)
      ...dto.messages.slice(-5, -1).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      // Current question
      { role: 'user', content: currentQuestion },
    ];

    this.logger.log(
      `Chat request — context blocks: ${contextBlocks.length}, history turns: ${dto.messages.length}`,
    );
    // Pass 400 as maxTokens to prevent runaway generation limits
    return this.llm.streamCompletion(messages, 400);
  }
}
