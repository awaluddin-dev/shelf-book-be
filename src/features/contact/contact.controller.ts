import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateInquiryDto } from './contact.dto';
import { RateLimitService } from 'src/common/services/rate-limit.service';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly rateLimitService: RateLimitService
  ) {}

  @Post('inquiry')
  async sendInquiry(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() dto: CreateInquiryDto
  ) {
    await this.rateLimitService.checkLimit(req);
    const result = await this.contactService.sendInquiry(dto);
    await this.rateLimitService.setLimit(req, res);
    return result;
  }
}
