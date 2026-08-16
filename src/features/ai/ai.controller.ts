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
@ApiResponse({ status: 400, description: 'Bad Request', schema: { example: { statusCode: 400, message: ['Validation failed'], error: 'Bad Request' } } })
@ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' } } })
@ApiResponse({ status: 403, description: 'Forbidden', schema: { example: { statusCode: 403, message: 'Forbidden resource', error: 'Forbidden' } } })
@ApiResponse({ status: 404, description: 'Not Found', schema: { example: { statusCode: 404, message: 'Resource not found', error: 'Not Found' } } })
@ApiResponse({ status: 429, description: 'Too Many Requests', schema: { example: { statusCode: 429, message: 'Too many requests, please try again later.', error: 'Too Many Requests' } } })
@ApiResponse({ status: 500, description: 'Internal Server Error', schema: { example: { statusCode: 500, message: 'Internal server error' } } })
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
    description: 'Returns an SSE stream explaining a project. Each chunk is a standard OpenAI streaming delta forwarded as-is.',
  })
  @ApiResponse({ status: 200, description: 'Successful stream' })
  @ApiResponse({ status: 500, description: 'Internal server error' , schema: { example: { statusCode: 500, message: 'Internal server error' } }})
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

      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
      reply.header('X-Accel-Buffering', 'no');

      // Convert the Web ReadableStream to a Node.js Readable stream.
      // By using reply.send(stream), Fastify will correctly trigger its onSend hooks,
      // ensuring that CORS headers (from app.enableCors) are properly attached!
      const stream = Readable.fromWeb(llmResponse.body as any);
      reply.send(stream);
    } catch (error) {
      this.logger.error('LLM streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
