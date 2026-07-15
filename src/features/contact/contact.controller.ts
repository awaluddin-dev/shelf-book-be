import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateInquiryDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('inquiry')
  async sendInquiry(@Body() dto: CreateInquiryDto) {
    return this.contactService.sendInquiry(dto);
  }
}
