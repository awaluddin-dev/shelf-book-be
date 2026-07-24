import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
