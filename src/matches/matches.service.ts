// src/matches/matches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { VendorsService } from '../vendors/vendors.service';
import { ProjectsService } from '../projects/projects.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    private vendorsService: VendorsService,
    private projectsService: ProjectsService,
    private notificationsService: NotificationsService,
  ) {}

  async rebuildMatches(
    projectId: string,
    userEmail?: string,
  ): Promise<Match[]> {
    const project = await this.projectsService.findOne(projectId, userEmail);

    // Find vendors that match the project criteria
    const vendors = await this.vendorsService.findByCountryAndServices(
      project.country,
      project.servicesNeeded,
    );

    const matches = [];

    for (const vendor of vendors) {
      const score = this.calculateMatchScore(project, vendor);

      // Upsert match
      let match = await this.matchesRepository.findOne({
        where: { projectId, vendorId: vendor.id },
      });

      if (match) {
        match.score = score;
      } else {
        match = this.matchesRepository.create({
          projectId,
          vendorId: vendor.id,
          score,
        });
      }

      const savedMatch = await this.matchesRepository.save(match);

      // Send notification for new matches
      if (!match.id) {
        try {
          await this.notificationsService.sendNewMatchNotification(
            savedMatch,
            project,
            vendor,
          );
        } catch (error) {
          console.error('Failed to send notification:', error);
        }
      }

      matches.push(savedMatch);
    }

    // Load vendor relations for response
    const matchesWithVendors = await this.matchesRepository.find({
      where: matches.map((m) => ({ id: m.id })),
      relations: ['vendor'],
    });

    return matchesWithVendors;
  }

  private calculateMatchScore(project: Project, vendor: Vendor): number {
    // Calculate services overlap
    const servicesOverlap = project.servicesNeeded.filter((service) =>
      vendor.servicesOffered.includes(service),
    ).length;

    // SLA weight (inverse - lower hours = higher weight)
    const slaWeight = Math.max(0, 5 - vendor.responseSlaHours / 24);

    // Score formula: services_overlap * 2 + rating + SLA_weight
    const score = servicesOverlap * 2 + Number(vendor.rating) + slaWeight;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  async getMatchesForProject(projectId: string): Promise<Match[]> {
    return this.matchesRepository.find({
      where: { projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }

  async refreshActiveProjectMatches(): Promise<void> {
    const activeProjects = await this.projectsRepository.find({
      where: { status: 'active' as any },
    });

    for (const project of activeProjects) {
      await this.rebuildMatches(project.id);
    }
  }
}
