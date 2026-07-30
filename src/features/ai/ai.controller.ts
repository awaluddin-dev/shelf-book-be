import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { AiService } from './ai.service';
import { ExplainProjectDto } from './dto/explain-project.dto';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  /**
   * POST /api/ai/explain-project
   *
   * Returns an SSE stream (text/event-stream).
   * Each chunk is a standard OpenAI streaming delta forwarded as-is.
   * Frontend reads via ReadableStream / EventSource.
   *
   * On error, sends a final SSE event: data: [ERROR] <message>\n\n
   */
  @Post('explain-project')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async explainProject(
    @Body() dto: ExplainProjectDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable Nginx buffering if behind proxy
      'Access-Control-Allow-Origin': process.env.FRONTEND_URL ?? '*',
    });

    try {
      const llmResponse = await this.aiService.streamProjectExplanation(dto);

      if (!llmResponse.body) {
        throw new Error('LLM response body is null');
      }

      const reader = llmResponse.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Forward the raw SSE chunks from the LLM provider directly to the client.
        // OpenAI-compatible providers already emit proper "data: {...}\n\n" format.
        const chunk = decoder.decode(value, { stream: true });
        reply.raw.write(chunk);
      }

      reply.raw.write('data: [DONE]\n\n');
    } catch (error) {
      this.logger.error('LLM streaming error', (error as Error).stack);
      reply.raw.write(`data: [ERROR] ${(error as Error).message}\n\n`);
    } finally {
      reply.raw.end();
    }
  }
}
