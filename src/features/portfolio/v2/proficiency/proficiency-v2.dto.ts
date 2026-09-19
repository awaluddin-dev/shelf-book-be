import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProficiencySkillItemDto {
  @ApiProperty({ example: 'Go (Golang)' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'PROD', enum: ['PROD', 'R&D'] })
  @IsIn(['PROD', 'R&D'])
  status: 'PROD' | 'R&D';
}

export class CreateProficiencyPillarV2Dto {
  @ApiProperty({ example: '01' })
  @IsString()
  pillarNumber: string;

  @ApiProperty({ example: 'Core Backend & Distributed Systems' })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'High-concurrency services, event-driven orchestration, idempotency, and IPC.',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Server' })
  @IsString()
  icon: string;

  @ApiProperty({ type: [ProficiencySkillItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProficiencySkillItemDto)
  skills: ProficiencySkillItemDto[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateProficiencyPillarV2Dto {
  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  pillarNumber?: string;

  @ApiPropertyOptional({ example: 'Core Backend & Distributed Systems' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example:
      'High-concurrency services, event-driven orchestration, idempotency, and IPC.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Server' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ type: [ProficiencySkillItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProficiencySkillItemDto)
  skills?: ProficiencySkillItemDto[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  order?: number;
}
