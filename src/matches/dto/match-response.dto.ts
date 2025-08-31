import { ApiProperty } from '@nestjs/swagger';
import { VendorResponseDto } from '../../vendors/dto/vendor-response.dto';

export class MatchResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  projectId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  vendorId: string;

  @ApiProperty({ example: 8.5, description: 'Match score calculated by algorithm' })
  score: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class MatchWithVendorDto extends MatchResponseDto {
  @ApiProperty({ type: VendorResponseDto })
  vendor: VendorResponseDto;
}

export class RebuildMatchesResponseDto {
  @ApiProperty({ example: 5, description: 'Number of matches created/updated' })
  count: number;

  @ApiProperty({ type: [MatchWithVendorDto] })
  matches: MatchWithVendorDto[];
}
