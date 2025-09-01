// src/analytics/analytics.service.ts
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

    console.log('Fetching analytics for matches after:', thirtyDaysAgo);

    // First, let's get all matches with vendor data
    // For debugging, let's remove the date filter temporarily
    const matches = await this.matchesRepository.find({
      relations: ['vendor'],
      // where: { createdAt: MoreThanOrEqual(thirtyDaysAgo) },
      order: { score: 'DESC' },
    });

    console.log('Total matches found:', matches.length);

    // If no matches, let's still return vendor data
    if (matches.length === 0) {
      // Get all vendors to show something
      const allVendors = await this.vendorsRepository.find();
      const results = {};

      for (const vendor of allVendors) {
        for (const country of vendor.countriesSupported) {
          if (!results[country]) {
            results[country] = {
              topVendors: [],
              documentCount: 0,
            };
          }

          // Add vendor if not already in top 3
          if (results[country].topVendors.length < 3) {
            results[country].topVendors.push({
              vendorId: vendor.id,
              vendorName: vendor.name,
              avgScore: vendor.rating, // Use rating as default score
              matchCount: 0,
            });
          }
        }
      }

      // Add document counts
      for (const country of Object.keys(results)) {
        const projects = await this.projectsRepository.find({
          where: { country },
          select: ['id'],
        });

        const projectIds = projects.map((p) => p.id);

        if (projectIds.length > 0) {
          const documentCounts =
            await this.documentsService.getDocumentsByProjectIds(projectIds);
          const totalDocuments = Array.from(documentCounts.values()).reduce(
            (sum, count) => sum + count,
            0,
          );
          results[country].documentCount = totalDocuments;
        }
      }

      return results;
    }

    // Process matches by vendor
    const vendorStats = new Map();

    for (const match of matches) {
      if (!match.vendor) continue;

      const vendorId = match.vendor.id;
      if (!vendorStats.has(vendorId)) {
        vendorStats.set(vendorId, {
          vendor: match.vendor,
          totalScore: 0,
          count: 0,
        });
      }

      const stats = vendorStats.get(vendorId);
      stats.totalScore += Number(match.score);
      stats.count += 1;
    }

    // Calculate averages and organize by country
    const vendorsByCountry = {};

    for (const [vendorId, stats] of vendorStats) {
      const avgScore = stats.totalScore / stats.count;

      for (const country of stats.vendor.countriesSupported) {
        if (!vendorsByCountry[country]) {
          vendorsByCountry[country] = [];
        }

        vendorsByCountry[country].push({
          vendorId: stats.vendor.id,
          vendorName: stats.vendor.name,
          avgScore: Math.round(avgScore * 100) / 100,
          matchCount: stats.count,
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

      const projectIds = projects.map((p) => p.id);

      // Get document counts from MongoDB
      let totalDocuments = 0;
      if (projectIds.length > 0) {
        const documentCounts =
          await this.documentsService.getDocumentsByProjectIds(projectIds);
        totalDocuments = Array.from(documentCounts.values()).reduce(
          (sum, count) => sum + count,
          0,
        );
      }

      results[country] = {
        topVendors,
        documentCount: totalDocuments,
      };
    }

    console.log('Analytics results:', results);
    return results;
  }

  async getVendorsWithExpiredSLAs(): Promise<Vendor[]> {
    // For this example, we'll consider SLAs expired if they're over 72 hours
    const expiredVendors = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.responseSlaHours > :maxHours', { maxHours: 72 })
      .getMany();

    console.log('Vendors with expired SLAs:', expiredVendors.length);
    return expiredVendors;
  }
}
