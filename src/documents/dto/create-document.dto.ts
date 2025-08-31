import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Project ID this document belongs to'
  })
  @IsString()
  projectId: string;

  @ApiProperty({ 
    example: 'USA Market Entry Strategy',
    description: 'Document title'
  })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'This document outlines the strategy for entering the US market...',
    description: 'Document content'
  })
  @IsString()
  content: string;

  @ApiProperty({ 
    example: ['usa', 'market-research', 'strategy'],
    description: 'Tags for categorizing and searching',
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({ 
    example: 'https://example.com/document.pdf',
    description: 'URL to the uploaded file (if any)'
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional({ 
    example: { department: 'Legal', version: '1.0', confidential: true },
    description: 'Additional metadata'
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
