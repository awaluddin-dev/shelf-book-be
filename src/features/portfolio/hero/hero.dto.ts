import { Prisma } from '@prisma/client';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PortfolioStatusDto {
  @ApiProperty({
    description: 'Current status of the portfolio',
    example: 'active',
  })
  @IsString()
  status!: string;
}

export class HeroConfigDto {
  @ApiPropertyOptional({
    description: 'Name of the portfolio owner',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Professional role or title',
    example: 'Frontend Engineer',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the person is open for new opportunities',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  openForWork?: boolean;

  @ApiPropertyOptional({
    description: 'Availability date or timeframe',
    example: 'Immediate',
  })
  @IsString()
  @IsOptional()
  availableFrom?: string;

  @ApiPropertyOptional({
    description: 'Additional dynamic configuration as JSON',
    example: { theme: 'dark' },
  })
  @IsOptional()
  config?: Prisma.InputJsonValue;
}

export class MetricDto {
  @ApiProperty({
    description: 'Numeric or string value of the metric',
    example: '99%',
  })
  @IsString()
  value!: string;

  @ApiProperty({
    description: 'Label describing the metric',
    example: 'Uptime',
  })
  @IsString()
  label!: string;

  @ApiPropertyOptional({
    description: 'Icon associated with the metric',
    example: 'uptime-icon',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the metric represents a cost or time saving',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isSavings?: boolean;
}

export class HeroResponseDto {
  @ApiProperty({ description: 'Hero configuration data', type: HeroConfigDto })
  heroConfig: HeroConfigDto;

  @ApiProperty({ description: 'List of hero metrics', type: [MetricDto] })
  metrics: MetricDto[];
}

export class PortfolioStatusResponseDto {
  @ApiProperty({
    description: 'Current status of the portfolio',
    example: 'active',
  })
  status: string;
}
