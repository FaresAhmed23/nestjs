import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project } from '../projects/entities/project.entity';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private documentsService: DocumentsService,
  ) {}

  async getTopVendorsPerCountry(): Promise<any> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get top vendors by average match score per country
    const topVendorsQuery = await this.matchesRepository
      .createQueryBuilder('match')
      .select('vendor.id', 'vendorId')
      .addSelect('vendor.name', 'vendorName')
      .addSelect('vendor.countriesSupported', 'countries')
      .addSelect('AVG(match.score)', 'avgScore')
      .addSelect('COUNT(match.id)', 'matchCount')
      .innerJoin('match.vendor', 'vendor')
      .where('match.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('vendor.id')
      .orderBy('avgScore', 'DESC')
      .getRawMany();

    // Process results by country
    const vendorsByCountry = {};
    
    for (const vendor of topVendorsQuery) {
      const countries = JSON.parse(vendor.countries);
      for (const country of countries) {
        if (!vendorsByCountry[country]) {
          vendorsByCountry[country] = [];
        }
        vendorsByCountry[country].push({
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName,
          avgScore: parseFloat(vendor.avgScore),
          matchCount: parseInt(vendor.matchCount),
        });
      }
    }

    // Get top 3 vendors per country and add document counts
    const results = {};
    
    for (const [country, vendors] of Object.entries(vendorsByCountry)) {
      // Sort and get top 3
      const topVendors = (vendors as any[])
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 3);

      // Get projects for this country
      const projects = await this.projectsRepository.find({
        where: { country },
        select: ['id'],
      });

      const projectIds = projects.map(p => p.id);
      
      // Get document counts from MongoDB
      const documentCounts = await this.documentsService.getDocumentsByProjectIds(projectIds);
      const totalDocuments = Array.from(documentCounts.values()).reduce((sum, count) => sum + count, 0);

      results[country] = {
        topVendors,
        documentCount: totalDocuments,
      };
    }

    return results;
  }

  async getVendorsWithExpiredSLAs(): Promise<Vendor[]> {
    // For this example, we'll consider SLAs expired if they're over 72 hours
    return this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.responseSlaHours > :maxHours', { maxHours: 72 })
      .getMany();
  }
}
