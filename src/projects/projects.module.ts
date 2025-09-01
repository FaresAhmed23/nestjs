// src/projects/projects.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { Client } from '../clients/entities/client.entity'; // Add this

@Module({
  imports: [TypeOrmModule.forFeature([Project, Client])], // Add Client here
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
