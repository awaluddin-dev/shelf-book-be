import { IsString, IsUUID, IsArray, IsOptional } from 'class-validator';

export class ExplainProjectDto {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  tech_stack: string[];

  @IsOptional()
  @IsString()
  metrics?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
