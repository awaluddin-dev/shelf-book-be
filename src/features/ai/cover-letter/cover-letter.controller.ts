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
import { CoverLetterService } from './cover-letter.service';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { DraftInquiryDto } from './dto/draft-inquiry.dto';
import { Readable } from 'stream';

@Controller('ai')
export class CoverLetterController {
  private readonly logger = new Logger(CoverLetterController.name);

  constructor(private readonly coverLetterService: CoverLetterService) {}

  /**
   * POST /api/ai/cover-letter
   * Body: { jobDescription: string }
   * Returns SSE stream (text/event-stream)
   */
  @Post('cover-letter')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async generateCoverLetter(
    @Body() dto: GenerateCoverLetterDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const llmResponse = await this.coverLetterService.streamCoverLetter(dto);

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
      this.logger.error('Cover letter streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  /**
   * POST /api/ai/draft-inquiry
   * Body: { coverLetter: string }
   * Returns SSE stream (text/event-stream)
   */
  @Post('draft-inquiry')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async draftInquiry(
    @Body() dto: DraftInquiryDto,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    try {
      const llmResponse = await this.coverLetterService.streamDraftInquiry(dto);

      if (!llmResponse.body) {
        throw new Error('LLM response body is null');
      }

      reply.header('Content-Type', 'text/event-stream');
      reply.header('Cache-Control', 'no-cache');
      reply.header('Connection', 'keep-alive');
      reply.header('X-Accel-Buffering', 'no');

      const stream = Readable.fromWeb(llmResponse.body as any);
      reply.send(stream);
    } catch (error) {
      this.logger.error('Draft inquiry streaming error', (error as Error).stack);
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
