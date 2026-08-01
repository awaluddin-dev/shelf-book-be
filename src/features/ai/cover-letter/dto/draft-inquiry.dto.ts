import { IsString, IsNotEmpty } from 'class-validator';

export class DraftInquiryDto {
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
