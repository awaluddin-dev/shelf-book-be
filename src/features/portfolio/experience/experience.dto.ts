import { IsString, IsOptional, IsArray } from 'class-validator';

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

  @IsString()
  @IsOptional()
  roadmapId?: string;
}
