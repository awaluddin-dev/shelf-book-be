import { Prisma } from '@prisma/client';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class ProjectDto {
  @IsString()
  title!: string;

  @IsString()
  subtitle!: string;

  @IsString()
  category!: string;

  @IsString()
  date!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  spineColor!: string;

  @IsString()
  coverColor!: string;

  @IsString()
  spineText!: string;

  @IsString()
  @IsOptional()
  github?: string;

  @IsString()
  @IsOptional()
  demoUrl?: string;

  @IsOptional()
  stats?: Prisma.InputJsonValue;

  @IsOptional()
  phases?: Prisma.InputJsonValue;

  @IsString()
  markdown!: string;

  @IsString()
  @IsOptional()
  reasonToBuild?: string;

  @IsString()
  @IsOptional()
  problemSolved?: string;
}

export class SystemArchitectureDto {
  @IsString()
  projectId!: string;

  @IsString()
  imageUrl!: string;

  @IsNumber()
  order!: number;
}

export class ProjectLifecycleDto {
  @IsString()
  projectId!: string;

  @IsString()
  stage!: string;

  @IsString()
  date!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  evidentUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class TechnicalImageryDto {
  @IsString()
  projectId!: string;

  @IsString()
  featured!: string;

  @IsString()
  blueprint!: string;

  @IsString()
  metrics!: string;

  @IsString()
  featuredCaption!: string;

  @IsString()
  blueprintCaption!: string;

  @IsString()
  metricsCaption!: string;
}
