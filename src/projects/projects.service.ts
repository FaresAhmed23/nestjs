// src/projects/projects.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Client } from '../clients/entities/client.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userEmail: string,
  ): Promise<Project> {
    // Find the client by email
    const client = await this.clientsRepository.findOne({
      where: { contactEmail: userEmail },
    });

    if (!client) {
      throw new NotFoundException(
        'Client profile not found. Please ensure your account is properly set up.',
      );
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      clientId: client.id,
    });
    return this.projectsRepository.save(project);
  }

  async findAll(userEmail?: string): Promise<Project[]> {
    if (userEmail) {
      // Find client by email first
      const client = await this.clientsRepository.findOne({
        where: { contactEmail: userEmail },
      });
      if (!client) return [];
      return this.projectsRepository.find({
        where: { clientId: client.id },
        relations: ['client'],
      });
    }
    return this.projectsRepository.find({ relations: ['client'] });
  }

  async findOne(id: string, userEmail?: string): Promise<Project> {
    const where = { id } as any;

    if (userEmail) {
      const client = await this.clientsRepository.findOne({
        where: { contactEmail: userEmail },
      });
      if (!client) {
        throw new NotFoundException('Client profile not found');
      }
      where.clientId = client.id;
    }

    const project = await this.projectsRepository.findOne({
      where,
      relations: ['client', 'matches'],
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userEmail?: string,
  ): Promise<Project> {
    const project = await this.findOne(id, userEmail);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userEmail?: string): Promise<void> {
    const project = await this.findOne(id, userEmail);
    await this.projectsRepository.remove(project);
  }
}
