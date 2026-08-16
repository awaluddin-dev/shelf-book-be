import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, IsOptional } from 'class-validator';

export class ExplainProjectDto {
  @ApiProperty({ description: 'The unique identifier of the project', example: 'proj_123abc' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The title of the project', example: 'E-commerce Platform' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'A detailed description of the project', example: 'An online store built with modern web technologies' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'List of technologies used in the project', example: ['React', 'Node.js', 'PostgreSQL'] })
  @IsArray()
  @IsString({ each: true })
  tech_stack: string[];

  @ApiProperty({ description: 'Key performance metrics or achievements', example: 'Increased sales by 20%', required: false })
  @IsOptional()
  @IsString()
  metrics?: string;

  @ApiProperty({ description: 'The role played in the project', example: 'Full Stack Developer', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}
