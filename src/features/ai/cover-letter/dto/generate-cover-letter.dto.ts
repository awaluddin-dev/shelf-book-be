import { IsString, MinLength, MaxLength } from 'class-validator';

export class GenerateCoverLetterDto {
  @IsString()
  @MinLength(10, { message: 'Job description too short — paste a bit more detail.' })
  @MaxLength(5000, { message: 'Job description too long (max 5000 characters).' })
  jobDescription: string;
}
