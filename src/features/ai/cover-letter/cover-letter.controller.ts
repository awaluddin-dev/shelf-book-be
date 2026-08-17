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
import { CoverLetterService } from './cover-letter.service';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { DraftInquiryDto } from './dto/draft-inquiry.dto';
import { Readable } from 'stream';

@ApiTags('AI Cover Letter')
@ApiGlobalResponses()
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
  @ApiOperation({
    summary: 'Stream cover letter generation',
    description:
      'Generates a cover letter based on the provided job description and returns an SSE stream.',
  })
  @ApiResponse({ status: 200, description: 'Successful stream' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: { example: { statusCode: 500, message: 'Internal server error' } },
  })
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
      const stream = Readable.fromWeb(
        llmResponse.body as import('stream/web').ReadableStream,
      );
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
  @ApiOperation({
    summary: 'Stream inquiry draft',
    description:
      'Drafts an inquiry based on the generated cover letter and returns an SSE stream.',
  })
  @ApiResponse({ status: 200, description: 'Successful stream' })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: { example: { statusCode: 500, message: 'Internal server error' } },
  })
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

      const stream = Readable.fromWeb(
        llmResponse.body as import('stream/web').ReadableStream,
      );
      reply.send(stream);
    } catch (error) {
      this.logger.error(
        'Draft inquiry streaming error',
        (error as Error).stack,
      );
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}
