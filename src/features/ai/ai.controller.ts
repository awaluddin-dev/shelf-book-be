import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { AiService } from './ai.service';
import { ExplainProjectDto } from './dto/explain-project.dto';
import { Readable } from 'node:stream';

@ApiTags('AI Core')
@ApiGlobalResponses()
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
  @ApiOperation({
    summary: 'Stream project explanation',
    description:
      'Returns an SSE stream explaining a project. Each chunk is a standard OpenAI streaming delta forwarded as-is.',
  })
  @ApiResponse({ status: 200, description: 'Successful stream' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: { example: { statusCode: 500, message: 'Internal server error' } },
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async explainProject(
    @Body() dto: ExplainProjectDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const llmResponse = await this.aiService.streamProjectExplanation(dto);

      if (!llmResponse.body) {
        throw new Error('LLM response body is null');
      }

      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.setHeader('X-Accel-Buffering', 'no');

      // Convert the Web ReadableStream to a Node.js Readable stream.
      // By using reply.send(stream), Fastify will correctly trigger its onSend hooks,
      // ensuring that CORS headers (from app.enableCors) are properly attached!
      const stream = Readable.fromWeb(
        llmResponse.body as import('stream/web').ReadableStream,
      );
      reply.send(stream);
    } catch (error) {
      this.logger.error('LLM streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
