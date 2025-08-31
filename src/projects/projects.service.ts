import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, clientId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      clientId,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(clientId?: string): Promise<Project[]> {
    const where = clientId ? { clientId } : {};
    return this.projectsRepository.find({ where, relations: ['client'] });
  }

  async findOne(id: string, clientId?: string): Promise<Project> {
    const where = { id } as any;
    if (clientId) where.clientId = clientId;
    
    const project = await this.projectsRepository.findOne({ 
      where, 
      relations: ['client', 'matches'] 
    });
    
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }
    
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, clientId?: string): Promise<Project> {
    const project = await this.findOne(id, clientId);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, clientId?: string): Promise<void> {
    const project = await this.findOne(id, clientId);
    await this.projectsRepository.remove(project);
  }
}
