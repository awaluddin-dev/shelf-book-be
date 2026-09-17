import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HeroConfigV2Dto {
  @ApiPropertyOptional({ example: 'hero_v2_default' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Awaluddin' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Backend Engineer & AI Integrator' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'Production Systems at Scale' })
  @IsString()
  headline: string;

  @ApiProperty({ example: 'I ship LLM integrations into production — not train models in notebooks.' })
  @IsString()
  quote: string;

  @ApiProperty({ example: 'available' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'Available for Remote Roles (UTC+7)' })
  @IsString()
  statusText: string;

  @ApiProperty({ example: '/assets/resume/Awaluddin_cv.pdf' })
  @IsString()
  resumeUrl: string;

  @ApiProperty({ example: 'https://sb.awaluddin.dev/docs' })
  @IsString()
  docsUrl: string;

  @ApiPropertyOptional({
    description: 'Long-form about text for portfolio about section (supports markdown or paragraphs)',
    example: 'Back in my early engineering days at Daikin HVAC...',
  })
  @IsOptional()
  @IsString()
  aboutText?: string;
}

export class MetricV2Dto {
  @ApiPropertyOptional({ example: 'uuid-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: '$18K / yr' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'Infrastructure Cost Saved' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'Cloud resource right-sizing & query indexing optimization at Telkomsel.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Documented Annual Impact' })
  @IsString()
  subtext: string;

  @ApiProperty({ example: 'DollarSign' })
  @IsString()
  icon: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateHeroV2Dto {
  @ApiPropertyOptional({ type: HeroConfigV2Dto })
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroConfigV2Dto)
  heroConfig?: Partial<HeroConfigV2Dto>;

  @ApiPropertyOptional({ type: [MetricV2Dto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricV2Dto)
  metrics?: MetricV2Dto[];
}
