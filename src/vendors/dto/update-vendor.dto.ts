import { PartialType } from '@nestjs/swagger';
import { CreateVendorDto } from './create-vendor.dto';
import { IsString, IsArray, IsNumber, Min, Max, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @ApiPropertyOptional({ example: 'Updated Vendor Name', description: 'Vendor company name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    example: ['USA', 'Canada', 'Mexico'], 
    description: 'Countries where vendor operates',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  countriesSupported?: string[];

  @ApiPropertyOptional({ 
    example: ['Legal', 'HR', 'Accounting', 'Tax'], 
    description: 'Services offered by vendor',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  servicesOffered?: string[];

  @ApiPropertyOptional({ example: 4.9, description: 'Vendor rating (0-5)', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ example: 12, description: 'Response time SLA in hours', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  responseSlaHours?: number;
}
