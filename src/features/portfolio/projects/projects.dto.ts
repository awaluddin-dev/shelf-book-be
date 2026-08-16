import { Prisma } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty({ description: 'Title of the project', example: 'E-commerce Platform' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Subtitle or short description', example: 'A scalable online store' })
  @IsString()
  subtitle!: string;

  @ApiProperty({ description: 'Category of the project', example: 'Web Application' })
  @IsString()
  category!: string;

  @ApiProperty({ description: 'Date or timeframe of the project', example: '2023-10-01' })
  @IsString()
  date!: string;

  @ApiProperty({ description: 'List of tags associated with the project', example: ['React', 'Node.js'] })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({ description: 'Color representing the spine of the project', example: '#ff0000' })
  @IsString()
  spineColor!: string;

  @ApiProperty({ description: 'Color representing the cover of the project', example: '#00ff00' })
  @IsString()
  coverColor!: string;

  @ApiProperty({ description: 'Text to display on the project spine', example: 'E-COMMERCE' })
  @IsString()
  spineText!: string;

  @ApiPropertyOptional({ description: 'GitHub repository URL', example: 'https://github.com/user/repo' })
  @IsString()
  @IsOptional()
  github?: string;

  @ApiPropertyOptional({ description: 'Live demo URL', example: 'https://demo.example.com' })
  @IsString()
  @IsOptional()
  demoUrl?: string;

  @ApiPropertyOptional({ description: 'Project statistics as JSON', example: { users: 1000 } })
  @IsOptional()
  stats?: Prisma.InputJsonValue;

  @ApiPropertyOptional({ description: 'Project phases as JSON', example: { phase1: 'Design' } })
  @IsOptional()
  phases?: Prisma.InputJsonValue;

  @ApiProperty({ description: 'Markdown content describing the project in detail', example: '# Introduction\nThis is a project.' })
  @IsString()
  markdown!: string;

  @ApiPropertyOptional({ description: 'Reason for building the project', example: 'To solve a personal pain point' })
  @IsString()
  @IsOptional()
  reasonToBuild?: string;

  @ApiPropertyOptional({ description: 'The specific problem this project solves', example: 'Reduces manual entry time' })
  @IsString()
  @IsOptional()
  problemSolved?: string;
}

export class SystemArchitectureDto {
  @ApiProperty({ description: 'ID of the associated project', example: 'proj-123' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'URL of the architecture image', example: 'https://example.com/arch.png' })
  @IsString()
  imageUrl!: string;

  @ApiProperty({ description: 'Display order of the architecture diagram', example: 1 })
  @IsNumber()
  order!: number;

  @ApiPropertyOptional({ description: 'Description of the system architecture', example: 'High-level overview of microservices' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class ProjectLifecycleDto {
  @ApiProperty({ description: 'ID of the associated project', example: 'proj-123' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'Stage of the lifecycle', example: 'Planning' })
  @IsString()
  stage!: string;

  @ApiProperty({ description: 'Date of this lifecycle stage', example: '2023-01-15' })
  @IsString()
  date!: string;

  @ApiProperty({ description: 'Title of the lifecycle event', example: 'Initial Kickoff' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Detailed description of the lifecycle stage', example: 'Met with stakeholders to define requirements.' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'URL for evidence or further details', example: 'https://jira.com/ticket-1' })
  @IsOptional()
  @IsString()
  evidentUrl?: string;

  @ApiPropertyOptional({ description: 'Display order of the lifecycle stage', example: 1 })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class TechnicalImageryDto {
  @ApiProperty({ description: 'ID of the associated project', example: 'proj-123' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'URL for the featured image', example: 'https://example.com/featured.png' })
  @IsString()
  featured!: string;

  @ApiProperty({ description: 'URL for the blueprint image', example: 'https://example.com/blueprint.png' })
  @IsString()
  blueprint!: string;

  @ApiProperty({ description: 'URL for the metrics image', example: 'https://example.com/metrics.png' })
  @IsString()
  metrics!: string;

  @ApiProperty({ description: 'Caption for the featured image', example: 'Main dashboard view' })
  @IsString()
  featuredCaption!: string;

  @ApiProperty({ description: 'Caption for the blueprint image', example: 'System wireframe' })
  @IsString()
  blueprintCaption!: string;

  @ApiProperty({ description: 'Caption for the metrics image', example: 'Performance metrics chart' })
  @IsString()
  metricsCaption!: string;
}

export class ProjectDatabaseSchemaDto {
  @ApiProperty({ description: 'ID of the associated project', example: 'proj-123' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'URL of the database schema image', example: 'https://example.com/schema.png' })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Description of the database schema', example: 'Core tables and relationships' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Display order of the database schema', example: 1 })
  @IsNumber()
  order!: number;
}

export class ProjectErdDto {
  @ApiProperty({ description: 'ID of the associated project', example: 'proj-123' })
  @IsString()
  projectId!: string;

  @ApiProperty({ description: 'URL of the ERD image', example: 'https://example.com/erd.png' })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Description of the Entity-Relationship Diagram', example: 'User and Auth domains' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Display order of the ERD', example: 1 })
  @IsNumber()
  order!: number;
}
