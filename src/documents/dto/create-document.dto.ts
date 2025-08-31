import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
