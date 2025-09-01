// src/vendors/dto/vendor-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Global Expansion Partners' })
  name: string;

  @ApiProperty({ example: ['USA', 'Canada', 'UK'], type: [String] })
  countriesSupported: string[];

  @ApiProperty({ example: ['Legal', 'HR', 'Accounting'], type: [String] })
  servicesOffered: string[];

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 24 })
  responseSlaHours: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
