import { ApiProperty } from '@nestjs/swagger';

export class VendorAnalyticsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  vendorId: string;

  @ApiProperty({ example: 'Global Expansion Partners' })
  vendorName: string;

  @ApiProperty({ example: 8.5, description: 'Average match score' })
  avgScore: number;

  @ApiProperty({ example: 15, description: 'Number of matches' })
  matchCount: number;
}

export class CountryAnalyticsDto {
  @ApiProperty({ type: [VendorAnalyticsDto], description: 'Top 3 vendors for this country' })
  topVendors: VendorAnalyticsDto[];

  @ApiProperty({ example: 42, description: 'Number of research documents for projects in this country' })
  documentCount: number;
}

export class TopVendorsResponseDto {
  @ApiProperty({ 
    example: {
      USA: {
        topVendors: [{
          vendorId: '123e4567-e89b-12d3-a456-426614174000',
          vendorName: 'Global Expansion Partners',
          avgScore: 8.5,
          matchCount: 15
        }],
        documentCount: 42
      }
    },
    description: 'Analytics data grouped by country'
  })
  [country: string]: CountryAnalyticsDto;
}

export class ExpiredSlaVendorDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Slow Response Vendor' })
  name: string;

  @ApiProperty({ example: 96, description: 'Response SLA in hours' })
  responseSlaHours: number;

  @ApiProperty({ example: ['USA', 'Canada'], type: [String] })
  countriesSupported: string[];

  @ApiProperty({ example: ['Legal', 'HR'], type: [String] })
  servicesOffered: string[];

  @ApiProperty({ example: 3.5 })
  rating: number;
}
