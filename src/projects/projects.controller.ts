// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ProjectResponseDto,
  ProjectWithClientDto,
} from './dto/project-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Create a new expansion project. Only clients can create projects.',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only clients can create projects',
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, req.user.email);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all projects',
    description:
      'Get all projects. Clients see only their projects, admins see all.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of projects',
    type: [ProjectWithClientDto],
  })
  findAll(@Request() req): Promise<ProjectWithClientDto[]> {
    const userEmail =
      req.user.role === UserRole.CLIENT ? req.user.email : undefined;
    return this.projectsService.findAll(userEmail);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by ID',
    description: 'Get detailed information about a specific project',
  })
  @ApiParam({
    name: 'id',
    description: 'Project UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Project details',
    type: ProjectWithClientDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProjectWithClientDto> {
    const userEmail =
      req.user.role === UserRole.CLIENT ? req.user.email : undefined;
    return this.projectsService.findOne(id, userEmail);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({
    summary: 'Update project',
    description:
      'Update project details. Only the client who owns the project can update it.',
  })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, updateProjectDto, req.user.email);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete project',
    description:
      'Delete a project. Only the client who owns the project can delete it.',
  })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.projectsService.remove(id, req.user.email);
  }
}
