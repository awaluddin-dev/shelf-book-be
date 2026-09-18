import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateDirectionV2Dto {
  @ApiProperty({ description: 'Title of the direction item', example: 'Rust for High-Throughput Microservices' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Category: learning, project, architecture, system', example: 'learning' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Type: current or future', example: 'current' })
  @IsString()
  @IsIn(['current', 'future'])
  type: string;

  @ApiProperty({ description: 'Quarter or timeline', example: 'Q1 2026' })
  @IsString()
  @IsNotEmpty()
  quarter: string;

  @ApiPropertyOptional({ description: 'Status: in_progress, planned, completed', default: 'in_progress' })
  @IsOptional()
  @IsIn(['in_progress', 'planned', 'completed'])
  status?: string;

  @ApiProperty({ description: 'Detailed description of the direction item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Depth level, e.g., Deep dive, Production ready' })
  @IsOptional()
  @IsString()
  depth?: string;

  @ApiPropertyOptional({ description: 'Tags or tech stack', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Lucide icon name' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Related link URL' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Related link label text' })
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiPropertyOptional({ description: 'Display order priority', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateDirectionV2Dto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['current', 'future'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  quarter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['in_progress', 'planned', 'completed'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  depth?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateYouTubeVideoV2Dto {
  @ApiProperty({ description: 'Video title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Video description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Video thumbnail URL' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Video URL' })
  @IsString()
  @IsNotEmpty()
  videoUrl: string;

  @ApiPropertyOptional({ description: 'Video duration string' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'Video views count' })
  @IsOptional()
  @IsString()
  views?: string;

  @ApiPropertyOptional({ description: 'Published Date' })
  @IsOptional()
  publishedAt?: Date;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateYouTubeVideoV2Dto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  views?: string;

  @ApiPropertyOptional()
  @IsOptional()
  publishedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;
}
