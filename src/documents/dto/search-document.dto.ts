import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDocumentDto {
  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filter by project ID'
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ 
    example: ['usa', 'legal'],
    description: 'Filter by tags',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ 
    example: 'employment law',
    description: 'Full text search query'
  })
  @IsOptional()
  @IsString()
  text?: string;
}
