import { Injectable, Logger } from '@nestjs/common';
import { ExplainProjectDto } from './dto/explain-project.dto';
import {
  LlmMessage,
  LlmProviderService,
} from './providers/llm-provider.service';
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly llm: LlmProviderService) {}

  async streamProjectExplanation(
    project: ExplainProjectDto,
  ): Promise<Response> {
    const techList = project.tech_stack.join(', ');

    const messages: LlmMessage[] = [
      {
        role: 'user',
        content: `You are a technical storyteller helping a recruiter or hiring manager understand software projects.
Your job is to explain a project clearly and compellingly in EXACTLY 3 short paragraphs.

CRITICAL INSTRUCTIONS:
1. NO Markdown formatting at all (no bold, no headers, no tables).
2. NO bullet points or numbered lists. Use flowing prose only.
3. Keep the total length strictly under 200 words.
4. Paragraph 1: What the project does and the problem it solves (plain English, no jargon).
5. Paragraph 2: Why the technical choices matter (brief, not a lecture).
6. Paragraph 3: What this says about the engineer who built it.
7. Avoid buzzwords like "leverage", "utilize", "robust", "scalable".
8. Speak directly: "This system does X" not "This project aims to achieve X".

Explain this project based on the data below:

Title: ${project.title}
Description: ${project.description}
Tech stack: ${techList}${project.metrics ? `\nMetrics: ${project.metrics}` : ''}${project.role ? `\nRole: ${project.role}` : ''}`,
      },
    ];

    this.logger.log(`Streaming explanation for project: ${project.id}`);
    return this.llm.streamCompletion(messages);
  }
}
