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
import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';
import { Readable } from 'node:stream';

@ApiTags('AI Chat')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  schema: {
    example: {
      statusCode: 400,
      message: ['Validation failed'],
      error: 'Bad Request',
    },
  },
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
})
@ApiResponse({
  status: 403,
  description: 'Forbidden',
  schema: {
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'Not Found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Resource not found',
      error: 'Not Found',
    },
  },
})
@ApiResponse({
  status: 429,
  description: 'Too Many Requests',
  schema: {
    example: {
      statusCode: 429,
      message: 'Too many requests, please try again later.',
      error: 'Too Many Requests',
    },
  },
})
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  schema: { example: { statusCode: 500, message: 'Internal server error' } },
})
@Controller('ai')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  /**
   * POST /api/ai/chat
   * Body: { messages: { role: 'user' | 'assistant', content: string }[] }
   * Returns SSE stream (text/event-stream)
   */
  @Post('chat')
  @ApiOperation({
    summary: 'Stream chat completion',
    description: 'Returns an SSE stream containing the AI chat response.',
  })
  @ApiResponse({ status: 200, description: 'Successful stream' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: { example: { statusCode: 500, message: 'Internal server error' } },
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async chat(@Body() dto: ChatDto, @Res() reply: FastifyReply): Promise<void> {
    try {
      const llmResponse = await this.chatService.streamChat(dto);

      if (!llmResponse.body) throw new Error('LLM response body is null');

      const contentType = llmResponse.headers.get('content-type') || '';

      // If the provider ignored stream: true and returned JSON directly
      if (contentType.includes('application/json')) {
        this.logger.warn(
          'LLM provider returned JSON instead of stream. Parsing and simulating stream...',
        );
        const json = (await llmResponse.json()) as {
          choices?: {
            message?: { content?: string };
            delta?: { content?: string };
          }[];
        };
        const content =
          json?.choices?.[0]?.message?.content ||
          json?.choices?.[0]?.delta?.content ||
          '';

        reply.header('Content-Type', 'text/event-stream');
        reply.header('Cache-Control', 'no-cache');
        reply.header('Connection', 'keep-alive');

        // Send a simulated SSE stream
        reply.raw.write(
          `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`,
        );
        reply.raw.write(`data: [DONE]\n\n`);
        reply.raw.end();
        return;
      }

      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
      reply.header('X-Accel-Buffering', 'no');

      const stream = Readable.fromWeb(
        llmResponse.body as import('stream/web').ReadableStream,
      );
      reply.send(stream);
    } catch (error) {
      this.logger.error('Chat streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
