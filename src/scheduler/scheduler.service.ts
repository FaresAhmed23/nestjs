import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchesService } from '../matches/matches.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class SchedulerService {
  constructor(
    private matchesService: MatchesService,
    private analyticsService: AnalyticsService,
    private notificationsService: NotificationsService,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshDailyMatches() {
    console.log('Starting daily match refresh...');
    
    try {
      // Refresh matches for all active projects
      await this.matchesService.refreshActiveProjectMatches();
      
      // Get all clients to send updates
      const clients = await this.clientsRepository.find();
      
      for (const client of clients) {
        // In a real app, you'd track new matches per client
        await this.notificationsService.sendDailyMatchUpdate(client.contactEmail, 0);
      }
      
      console.log('Daily match refresh completed');
    } catch (error) {
      console.error('Error in daily match refresh:', error);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async checkExpiredSLAs() {
    console.log('Checking for expired SLAs...');
    
    try {
      const expiredVendors = await this.analyticsService.getVendorsWithExpiredSLAs();
      
      if (expiredVendors.length > 0) {
        // Send to admin (you'd get this from config or admin users)
        await this.notificationsService.sendExpiredSLANotification(
          'admin@expanders360.com',
          expiredVendors
        );
      }
      
      console.log(`Found ${expiredVendors.length} vendors with expired SLAs`);
    } catch (error) {
      console.error('Error checking expired SLAs:', error);
    }
  }
}
