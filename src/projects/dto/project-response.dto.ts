import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class ProjectResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  clientId: string;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: ['Legal', 'HR', 'Accounting'], type: [String] })
  servicesNeeded: string[];

  @ApiProperty({ example: 50000 })
  budget: number;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}

export class ProjectWithClientDto extends ProjectResponseDto {
  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      companyName: 'Test Company',
      contactEmail: 'client@example.com',
    },
  })
  client: {
    id: string;
    companyName: string;
    contactEmail: string;
  };
}
