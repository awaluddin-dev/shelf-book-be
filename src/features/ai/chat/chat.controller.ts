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
import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';
import { Readable } from 'node:stream';

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
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async chat(@Body() dto: ChatDto, @Res() reply: FastifyReply): Promise<void> {
    try {
      const llmResponse = await this.chatService.streamChat(dto);

      if (!llmResponse.body) throw new Error('LLM response body is null');

      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
      reply.header('X-Accel-Buffering', 'no');

      const stream = Readable.fromWeb(llmResponse.body as any);
      reply.send(stream);
    } catch (error) {
      this.logger.error('Chat streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
