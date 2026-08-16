import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The role of the message sender',
    example: 'user',
  })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how can you help me?',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}

export class ChatDto {
  @ApiProperty({
    description: 'The list of messages in the chat history',
    type: [ChatMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10) // prevent context stuffing
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
}
