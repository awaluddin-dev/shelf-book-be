import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProficiencySkillDto {
  @ApiProperty({ description: 'Name of the specific skill', example: 'React' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Additional subtext or context for the skill', example: 'Hooks, Context API' })
  @IsString()
  subtext!: string;

  @ApiProperty({ description: 'Current status or proficiency level', example: 'Advanced' })
  @IsString()
  status!: string;
}

export class ProficiencyDto {
  @ApiProperty({ description: 'Title of the proficiency area', example: 'Frontend Development' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'List of skills under this proficiency', type: [ProficiencySkillDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProficiencySkillDto)
  skills!: ProficiencySkillDto[];
}

export class SkillDto {
  @ApiProperty({ description: 'Title of the skill', example: 'TypeScript' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'ID of the category this skill belongs to', example: 'cat-123' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'ID of the associated proficiency skill', example: 'prof-456' })
  @IsOptional()
  @IsString()
  proficiencySkillId?: string;

  @ApiProperty({ description: 'Proficiency level of the skill', example: 'Expert' })
  @IsString()
  level!: string;

  @ApiProperty({ description: 'Detailed description of the skill', example: 'Strong understanding of static typing and advanced types.' })
  @IsString()
  details!: string;

  @ApiPropertyOptional({ description: 'X-coordinate for visualizing the skill on a graph', example: 10 })
  @IsOptional()
  x?: number;

  @ApiPropertyOptional({ description: 'Y-coordinate for visualizing the skill on a graph', example: 20 })
  @IsOptional()
  y?: number;

  @ApiPropertyOptional({ description: 'List of connected skill IDs', example: ['skill-1', 'skill-2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  connections?: string[];
}

export class RoadmapDto {
  @ApiProperty({ description: 'Technology being learned', example: 'GraphQL' })
  @IsString()
  tech!: string;

  @ApiProperty({ description: 'Target quarter for the roadmap item', example: 'Q3 2024' })
  @IsString()
  quarter!: string;

  @ApiProperty({ description: 'Current status of the roadmap item', example: 'In Progress' })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ description: 'Icon representing the technology', example: 'graphql-icon' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'Detailed description of the learning goal', example: 'Understanding queries, mutations, and subscriptions.' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ description: 'Expected depth of knowledge', example: 'Intermediate' })
  @IsString()
  @IsOptional()
  depth?: string;

  @ApiProperty({ description: 'List of specific topics to cover', example: ['Apollo Server', 'Resolvers'] })
  @IsArray()
  @IsString({ each: true })
  topics!: string[];

  @ApiProperty({ description: 'List of practical projects to build', example: ['E-commerce API', 'Real-time chat'] })
  @IsArray()
  @IsString({ each: true })
  projects!: string[];
}

export class LearningResponseDto {
  @ApiProperty({ description: 'List of roadmap items', type: [RoadmapDto] })
  roadmap: RoadmapDto[];
}
