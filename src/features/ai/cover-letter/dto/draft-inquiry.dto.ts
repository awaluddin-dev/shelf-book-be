import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DraftInquiryDto {
  @ApiProperty({
    description: 'The generated cover letter content used to draft an inquiry',
    example: 'Dear Hiring Manager, ...',
  })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
