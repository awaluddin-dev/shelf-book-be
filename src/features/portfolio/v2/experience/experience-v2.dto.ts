import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CareerBulletDto {
  @ApiProperty({ example: 'Managing core enterprise fleet telemetry' })
  @IsString()
  situation: string;

  @ApiProperty({ example: 'engineered event-driven microservices' })
  @IsString()
  action: string;

  @ApiProperty({ example: '99.9% uptime' })
  @IsString()
  metric: string;

  @ApiPropertyOptional({ example: 'by ' })
  @IsOptional()
  @IsString()
  metricPrefix?: string;

  @ApiPropertyOptional({ example: ' across distributed operations.' })
  @IsOptional()
  @IsString()
  metricSuffix?: string;
}

export class CreateCareerExperienceV2Dto {
  @ApiProperty({ example: 'PT Serasi Autoraya (SERA) — Astra Group' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Backend Engineer' })
  @IsString()
  role: string;

  @ApiProperty({ example: '2024 – Present' })
  @IsString()
  period: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [CareerBulletDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CareerBulletDto)
  bullets: CareerBulletDto[];

  @ApiProperty({ example: ['Go (Golang)', 'Node.js', 'PostgreSQL'] })
  @IsArray()
  @IsString({ each: true })
  techTags: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateCareerExperienceV2Dto {
  @ApiPropertyOptional({ example: 'PT Serasi Autoraya (SERA) — Astra Group' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Backend Engineer' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: '2024 – Present' })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CareerBulletDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CareerBulletDto)
  bullets?: CareerBulletDto[];

  @ApiPropertyOptional({ example: ['Go (Golang)', 'Node.js', 'PostgreSQL'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techTags?: string[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}
