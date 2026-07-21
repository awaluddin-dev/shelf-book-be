import { Prisma } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PortfolioStatusDto {
  @IsString()
  status!: string;
}

export class HeroConfigDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  openForWork?: boolean;

  @IsString()
  @IsOptional()
  availableFrom?: string;

  @IsOptional()
  config?: Prisma.InputJsonValue;
}

export class MetricDto {
  @IsString()
  value!: string;

  @IsString()
  label!: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isSavings?: boolean;
}

export class TestimonialDto {
  @IsString()
  name!: string;

  @IsString()
  role!: string;

  @IsString()
  company!: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  testimonial!: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class WorkExperienceDto {
  @IsString()
  years!: string;

  @IsString()
  duration!: string;

  @IsString()
  company!: string;

  @IsString()
  role!: string;

  @IsString()
  stack!: string;

  @IsString()
  teaser!: string;

  @IsString()
  fullImpact!: string;

  @IsArray()
  @IsString({ each: true })
  bullets!: string[];
}

export class CurrentFocusDto {
  @IsString()
  title!: string;

  @IsString()
  icon!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  linkText?: string;
}

export class ProficiencySkillDto {
  @IsString()
  name!: string;

  @IsString()
  subtext!: string;

  @IsString()
  status!: string;
}

export class ProficiencyDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProficiencySkillDto)
  skills!: ProficiencySkillDto[];
}

export class SkillDto {
  @IsString()
  title!: string;

  @IsString()
  category!: string;

  @IsString()
  level!: string;

  @IsString()
  details!: string;

  @IsOptional()
  x?: number;

  @IsOptional()
  y?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  connections?: string[];
}

export class RoadmapDto {
  @IsString()
  tech!: string;

  @IsString()
  quarter!: string;

  @IsString()
  status!: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  depth?: string;

  @IsArray()
  @IsString({ each: true })
  topics!: string[];

  @IsArray()
  @IsString({ each: true })
  projects!: string[];
}

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

  @IsString()
  @IsOptional()
  architectureImage?: string;
}


export class SystemArchitectureDto {
  @IsString()
  projectId!: string;

  @IsString()
  name!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  metrics!: string;

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
