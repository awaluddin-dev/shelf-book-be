import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class GenerateCoverLetterDto {
  @ApiProperty({ description: 'The job description for the target position', example: 'We are looking for a Senior Software Engineer with experience in React and Node.js.' })
  @IsString()
  @MinLength(10, { message: 'Job description too short — paste a bit more detail.' })
  @MaxLength(5000, { message: 'Job description too long (max 5000 characters).' })
  jobDescription: string;
}
