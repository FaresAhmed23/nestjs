// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async sendNewMatchNotification(
    match: Match,
    project: Project,
    vendor: Vendor,
  ): Promise<void> {
    try {
      // Get client email
      const client = await this.clientsRepository.findOne({
        where: { id: project.clientId },
      });

      if (!client) {
        console.error('Client not found for project:', project.id);
        return;
      }

      await this.mailerService.sendMail({
        to: client.contactEmail,
        subject: `New vendor match for your project in ${project.country}`,
        html: `
          <h2>New Vendor Match!</h2>
          <p>We found a new vendor match for your expansion project in ${project.country}.</p>
          <h3>Vendor Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${vendor.name}</li>
            <li><strong>Rating:</strong> ${vendor.rating}/5</li>
            <li><strong>Response Time:</strong> ${vendor.responseSlaHours} hours</li>
            <li><strong>Match Score:</strong> ${match.score}</li>
          </ul>
          <p>Services offered: ${vendor.servicesOffered.join(', ')}</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // In production, you might want to queue failed emails for retry
    }
  }

  async sendDailyMatchUpdate(email: string, matchCount: number): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Daily Match Update - Expanders360',
        html: `
          <h2>Daily Match Update</h2>
          <p>Your daily match update is ready.</p>
          <p>We refreshed matches for your active projects and found ${matchCount} new potential vendors.</p>
          <p>Log in to your dashboard to review the matches.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send daily update:', error);
    }
  }

  async sendExpiredSLANotification(
    adminEmail: string,
    vendors: Vendor[],
  ): Promise<void> {
    try {
      const vendorList = vendors
        .map((v) => `<li>${v.name} - ${v.responseSlaHours} hours</li>`)
        .join('');

      await this.mailerService.sendMail({
        to: adminEmail,
        subject: 'Vendors with Expired SLAs',
        html: `
          <h2>Vendors with Expired SLAs</h2>
          <p>The following vendors have SLAs that exceed the threshold:</p>
          <ul>${vendorList}</ul>
          <p>Please review and update their SLA commitments.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send SLA notification:', error);
    }
  }
}
