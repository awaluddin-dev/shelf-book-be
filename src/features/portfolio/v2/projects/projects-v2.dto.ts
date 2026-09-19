import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsArray, IsBoolean } from 'class-validator';

export class CreateProjectV2Dto {
  @ApiProperty({ example: 'AuraFlow AI Orchestrator' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Autonomous Multi-Agent Workflow Engine' })
  @IsString()
  subtitle: string;

  @ApiProperty({ example: 'AI Systems' })
  @IsString()
  category: string;

  @ApiProperty({ example: '2024' })
  @IsString()
  date: string;

  @ApiProperty({ example: ['LangGraph', 'TypeScript', 'Redis BullMQ'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({ example: 'AI Systems & Distributed Queue' })
  @IsOptional()
  @IsString()
  domainBadge?: string;

  @ApiPropertyOptional({ example: 'Cascading timeouts and uncontrolled LLM execution latencies.' })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({ example: 'Decoupled queue workers with LangGraph state checkpoints.' })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional({ example: ['Gateway', 'BullMQ', 'LangGraph', 'PostgreSQL'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pipelineFlow?: string[];

  @ApiPropertyOptional({ example: '#0f4c75' })
  @IsOptional()
  @IsString()
  spineColor?: string;

  @ApiPropertyOptional({ example: '#142028' })
  @IsOptional()
  @IsString()
  coverColor?: string;

  @ApiPropertyOptional({ example: 'AURAFLOW' })
  @IsOptional()
  @IsString()
  spineText?: string;

  @ApiPropertyOptional({ example: 'https://github.com/awaluddin-dev/auraflow' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://auraflow.example.com' })
  @IsOptional()
  @IsString()
  demoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  stats?: any;

  @ApiPropertyOptional()
  @IsOptional()
  phases?: any;

  @ApiPropertyOptional({ example: '# Overview' })
  @IsOptional()
  @IsString()
  markdown?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'gif' })
  @IsOptional()
  @IsString()
  mediaType?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ example: 'https://raw.githubusercontent.com/...' })
  @IsOptional()
  @IsString()
  architectureDiagram?: string;

  @ApiPropertyOptional({ example: ['Handled 100K+ concurrent requests', 'Sub-50ms latency'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyHighlights?: string[];
}

export class UpdateProjectV2Dto {
  @ApiPropertyOptional({ example: 'AuraFlow AI Orchestrator' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Autonomous Multi-Agent Workflow Engine' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'AI Systems' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: '2024' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: ['LangGraph', 'TypeScript', 'Redis BullMQ'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'AI Systems & Distributed Queue' })
  @IsOptional()
  @IsString()
  domainBadge?: string;

  @ApiPropertyOptional({ example: 'Cascading timeouts and uncontrolled LLM execution latencies.' })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({ example: 'Decoupled queue workers with LangGraph state checkpoints.' })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional({ example: ['Gateway', 'BullMQ', 'LangGraph', 'PostgreSQL'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pipelineFlow?: string[];

  @ApiPropertyOptional({ example: '#0f4c75' })
  @IsOptional()
  @IsString()
  spineColor?: string;

  @ApiPropertyOptional({ example: '#142028' })
  @IsOptional()
  @IsString()
  coverColor?: string;

  @ApiPropertyOptional({ example: 'AURAFLOW' })
  @IsOptional()
  @IsString()
  spineText?: string;

  @ApiPropertyOptional({ example: 'https://github.com/awaluddin-dev/auraflow' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://auraflow.example.com' })
  @IsOptional()
  @IsString()
  demoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  stats?: any;

  @ApiPropertyOptional()
  @IsOptional()
  phases?: any;

  @ApiPropertyOptional({ example: '# Overview' })
  @IsOptional()
  @IsString()
  markdown?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 'gif' })
  @IsOptional()
  @IsString()
  mediaType?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ example: 'https://raw.githubusercontent.com/...' })
  @IsOptional()
  @IsString()
  architectureDiagram?: string;

  @ApiPropertyOptional({ example: ['Handled 100K+ concurrent requests', 'Sub-50ms latency'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyHighlights?: string[];
}
