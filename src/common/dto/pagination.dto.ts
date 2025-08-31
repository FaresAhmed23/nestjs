import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationMetaDto {
  //@ts-ignore
  @ApiProperty({ example: 100 })
  total: number;
  //@ts-ignore
  @ApiProperty({ example: 1 })
  page: number;
  //@ts-ignore
  @ApiProperty({ example: 10 })
  limit: number;
  //@ts-ignore
  @ApiProperty({ example: 10 })
  totalPages: number;
  //@ts-ignore
  @ApiProperty({ example: true })
  hasNext: boolean;
  //@ts-ignore
  @ApiProperty({ example: false })
  hasPrevious: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}
