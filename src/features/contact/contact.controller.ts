import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ContactService } from './contact.service';
import { CreateInquiryDto, ContactResponseDto } from './contact.dto';
import { RateLimitService } from 'src/common/services/rate-limit.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contact')
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
