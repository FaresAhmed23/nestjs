// src/vendors/dto/create-vendor.dto.ts
import {
  IsString,
  IsArray,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Global Expansion Partners' })
  @IsString()
  name: string;

  @ApiProperty({
    example: ['USA', 'Canada', 'UK'],
    description: 'Countries where vendor operates',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  countriesSupported: string[];

  @ApiProperty({
    example: ['Legal', 'HR', 'Accounting'],
    description: 'Services offered by vendor',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  servicesOffered: string[];

  @ApiProperty({
    example: 4.5,
    description: 'Vendor rating (0-5)',
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 24,
    description: 'Response time SLA in hours',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  responseSlaHours: number;
}
