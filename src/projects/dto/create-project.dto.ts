import {
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'USA', description: 'Target country for expansion' })
  @IsString()
  country: string;

  @ApiProperty({
    example: ['Legal', 'HR', 'Accounting'],
    description: 'Services needed for the project',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  servicesNeeded: string[];

  @ApiProperty({
    example: 50000,
    description: 'Project budget in USD',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
    description: 'Project status',
    default: ProjectStatus.ACTIVE,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus = ProjectStatus.ACTIVE;
}
