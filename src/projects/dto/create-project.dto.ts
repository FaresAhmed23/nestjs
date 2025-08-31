import { IsString, IsArray, IsNumber, IsEnum, ArrayMinSize } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  country: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  servicesNeeded: string[];

  @IsNumber()
  budget: number;

  @IsEnum(ProjectStatus)
  status: ProjectStatus = ProjectStatus.ACTIVE;
}
