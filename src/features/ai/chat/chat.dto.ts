import {
  IsString,
  IsArray,
  IsIn,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}

export class ChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10) // prevent context stuffing
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
