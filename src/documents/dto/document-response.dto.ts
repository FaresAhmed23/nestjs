import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId',
  })
  _id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  projectId: string;

  @ApiProperty({ example: 'USA Market Entry Strategy' })
  title: string;

  @ApiProperty({ example: 'This document outlines the strategy...' })
  content: string;

  @ApiProperty({
    example: ['usa', 'market-research', 'strategy'],
    type: [String],
  })
  tags: string[];

  @ApiPropertyOptional({ example: 'admin@expanders360.com' })
  uploadedBy?: string;

  @ApiPropertyOptional({ example: 'https://example.com/document.pdf' })
  fileUrl?: string;
  //@ts-ignore
  @ApiPropertyOptional({
    example: { department: 'Legal', version: '1.0' },
    type: 'object',
  })
  metadata?: Record<string, any>;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class DocumentSearchResultDto {
  @ApiProperty({ type: [DocumentResponseDto] })
  documents: DocumentResponseDto[];

  @ApiProperty({ example: 10, description: 'Total matching documents' })
  total: number;
}
