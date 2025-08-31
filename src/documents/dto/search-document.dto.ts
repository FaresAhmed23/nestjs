import { IsString, IsArray, IsOptional } from 'class-validator';

export class SearchDocumentDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  text?: string;
}
