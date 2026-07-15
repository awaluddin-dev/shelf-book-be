import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Resend } from 'resend';
import { CreateInquiryDto } from './contact.dto';

@Injectable()
export class ContactService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendInquiry(dto: CreateInquiryDto) {
    if (!process.env.RESEND_API_KEY) {
      throw new HttpException('Resend API key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Inquiry <onboarding@resend.dev>',
        to: 'awal14h@gmail.com',
        replyTo: dto.email,
        subject: `New Inquiry from ${dto.name} - ${dto.projectType}`,
        html: `
          <h2>New Inquiry from Portfolio</h2>
          <p><strong>Name:</strong> ${dto.name}</p>
          <p><strong>Email:</strong> ${dto.email}</p>
          <p><strong>Project Type:</strong> ${dto.projectType}</p>
          <br />
          <h3>Message:</h3>
          <p>${dto.message.replace(/\n/g, '<br/>')}</p>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return { success: true, message: 'Inquiry sent successfully', id: data?.id };
    } catch (error) {
      console.error('Email send error:', error);
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
