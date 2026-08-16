import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestimonialDto {
  @ApiProperty({
    description: 'Full name of the person giving the testimonial',
    example: 'Jane Smith',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Role or job title of the person',
    example: 'Senior Software Engineer',
  })
  @IsString()
  role!: string;

  @ApiProperty({
    description: 'Company where the person works',
    example: 'Tech Corp',
  })
  @IsString()
  company!: string;

  @ApiPropertyOptional({
    description: "URL to the person's profile or company",
    example: 'https://linkedin.com/in/janesmith',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'The testimonial message content',
    example:
      'An outstanding developer who consistently delivers high-quality code.',
  })
  @IsString()
  testimonial!: string;

  @ApiPropertyOptional({
    description: 'Status of the testimonial (e.g., pending, approved)',
    example: 'approved',
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class WorkExperienceDto {
  @ApiProperty({
    description: 'Years of experience or specific year range',
    example: '2020 - Present',
  })
  @IsString()
  years!: string;

  @ApiProperty({
    description: 'Duration of the experience in months or years',
    example: '3 years 2 months',
  })
  @IsString()
  duration!: string;

  @ApiProperty({ description: 'Name of the company', example: 'Google' })
  @IsString()
  company!: string;

  @ApiProperty({
    description: 'Job role or title',
    example: 'Full Stack Developer',
  })
  @IsString()
  role!: string;

  @ApiProperty({
    description: 'Technology stack used during this experience',
    example: 'React, Node.js, TypeScript',
  })
  @IsString()
  stack!: string;

  @ApiProperty({
    description: 'Short summary or teaser of the work done',
    example: 'Led the development of a scalable microservices architecture.',
  })
  @IsString()
  teaser!: string;

  @ApiProperty({
    description: 'Detailed description of the full impact and achievements',
    example:
      'Reduced system latency by 40% and improved user retention by 15% through optimized queries and modern UI.',
  })
  @IsString()
  fullImpact!: string;

  @ApiProperty({
    description: 'List of specific achievements and responsibilities',
    example: ['Developed RESTful APIs', 'Mentored junior developers'],
  })
  @IsArray()
  @IsString({ each: true })
  bullets!: string[];
}

export class CurrentFocusDto {
  @ApiProperty({
    description: 'Title of the current focus or goal',
    example: 'Learning Rust',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Icon representing the focus',
    example: 'rust-icon',
  })
  @IsString()
  icon!: string;

  @ApiProperty({
    description: 'Detailed description of the focus',
    example: 'Building systems-level projects to understand memory safety.',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    description: 'Link to relevant resources or projects',
    example: 'https://github.com/user/rust-project',
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({
    description: 'Display text for the link',
    example: 'View Project',
  })
  @IsString()
  @IsOptional()
  linkText?: string;

  @ApiPropertyOptional({
    description: 'Associated roadmap ID if applicable',
    example: 'roadmap-123',
  })
  @IsString()
  @IsOptional()
  roadmapId?: string;
}
