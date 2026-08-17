import { ApiGlobalResponses } from 'src/common/decorators/api-global-responses.decorator';
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ContactService } from './contact.service';
import { CreateInquiryDto, ContactResponseDto } from './contact.dto';
import { RateLimitService } from 'src/common/services/rate-limit.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contact')
@ApiGlobalResponses()
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  @Post('inquiry')
  @ApiOperation({ summary: 'Send a contact inquiry or message' })
  @ApiResponse({
    status: 201,
    description: 'Inquiry successfully sent',
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests (Rate limited)',
    schema: {
      example: {
        statusCode: 429,
        message: 'Too many requests, please try again later.',
        error: 'Too Many Requests',
      },
    },
  })
  async sendInquiry(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dto: CreateInquiryDto,
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.contactService.sendInquiry(dto);
    await this.rateLimitService.setLimit(req, res);
    return result;
  }
}
