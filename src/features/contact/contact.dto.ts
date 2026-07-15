import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  projectType: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
