import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateResumeDto {
  @ApiProperty({
    description: 'Document title (e.g. Fullstack Developer CV)',
    example: 'Awaluddin - Fullstack Engineer Resume',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Document description or notes',
    example: 'Latest resume focused on backend & AI integrations',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Mark this document as primary resume',
    default: false,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateResumeDto {
  @ApiPropertyOptional({
    description: 'Document title',
    example: 'Awaluddin - Senior Backend Resume',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Document description',
    example: 'Updated with recent 2026 projects',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Mark this document as primary resume',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPrimary?: boolean;
}

export class ResumeDocumentResponseDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  id!: string;

  @ApiProperty({ example: 'Awaluddin - Fullstack Engineer Resume' })
  title!: string;

  @ApiPropertyOptional({ example: 'Latest resume focused on backend & AI' })
  description?: string | null;

  @ApiProperty({ example: 'pdf' })
  fileType!: string;

  @ApiProperty({ example: 'resume_awaluddin.pdf' })
  fileName!: string;

  @ApiProperty({ example: 'documents/1715000000000-resume_awaluddin.pdf' })
  filePath!: string;

  @ApiProperty({ example: 1048576 })
  fileSize!: number;

  @ApiProperty({ example: 'application/pdf' })
  mimeType!: string;

  @ApiProperty({ example: true })
  isPrimary!: boolean;

  @ApiProperty({ example: '2026-09-14T08:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-14T08:00:00.000Z' })
  updatedAt!: Date;
}

export class UploadResumeDto extends CreateResumeDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Resume document file (.pdf or .md)',
  })
  file!: any;
}
