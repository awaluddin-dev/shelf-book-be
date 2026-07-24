import { Prisma } from '@prisma/client';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

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
