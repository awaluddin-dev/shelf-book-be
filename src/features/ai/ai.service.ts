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
        role: 'system',
        content: `You are a technical storyteller helping a recruiter or hiring manager understand software projects.
Your job is to explain a project clearly and compellingly in 3 short paragraphs:
1. What the project does and the problem it solves (plain English, no jargon)
2. Why the technical choices matter (brief, not a lecture)  
3. What this says about the engineer who built it

Rules:
- Max 200 words total
- No bullet points — flowing prose only
- Avoid buzzwords like "leverage", "utilize", "robust", "scalable"
- Speak directly: "This system does X" not "This project aims to achieve X"
- If metrics are provided, lead with them — concrete numbers build credibility`,
      },
      {
        role: 'user',
        content: `Explain this project:

Title: ${project.title}
Description: ${project.description}
Tech stack: ${techList}${project.metrics ? `\nMetrics: ${project.metrics}` : ''}${project.role ? `\nRole: ${project.role}` : ''}`,
      },
    ];

    this.logger.log(`Streaming explanation for project: ${project.id}`);
    return this.llm.streamCompletion(messages);
  }
}
