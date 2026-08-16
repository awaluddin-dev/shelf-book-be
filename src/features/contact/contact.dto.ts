import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({
    description: 'Full name of the person sending the inquiry',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the sender',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Type of the project or inquiry',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  projectType: string;

  @ApiProperty({
    description: 'Detailed message or inquiry content',
    example: 'I would like to discuss a potential project for my new business.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ContactResponseDto {
  @ApiProperty({
    description: 'Result message or status',
    example: 'Inquiry successfully sent',
  })
  message: string;
}
