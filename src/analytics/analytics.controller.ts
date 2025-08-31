import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { CountryAnalyticsDto, ExpiredSlaVendorDto } from './dto/analytics-response.dto';

@ApiTags('Analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get top vendors per country',
    description: 'Get top 3 vendors by average match score per country with document counts (Admin only)'
  })
  @ApiOkResponse({
    description: 'Top vendors analytics data',
    schema: {
      type: 'object',
      example: {
        'USA': {
          topVendors: [
            {
              vendorId: '123e4567-e89b-12d3-a456-426614174000',
              vendorName: 'Global Expansion Partners',
              avgScore: 8.5,
              matchCount: 15
            }
          ],
          documentCount: 42
        },
        'Germany': {
          topVendors: [
            {
              vendorId: '345e6789-e89b-12d3-a456-426614174002',
              vendorName: 'European Expansion GmbH',
              avgScore: 8.2,
              matchCount: 18
            }
          ],
          documentCount: 28
        }
      },
      additionalProperties: {
        type: 'object',
        properties: {
          topVendors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                vendorId: { type: 'string' },
                vendorName: { type: 'string' },
                avgScore: { type: 'number' },
                matchCount: { type: 'number' }
              }
            }
          },
          documentCount: { type: 'number' }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getTopVendors(): Promise<Record<string, CountryAnalyticsDto>> {
    return this.analyticsService.getTopVendorsPerCountry();
  }

  @Get('expired-slas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get vendors with expired SLAs',
    description: 'Get vendors with response SLA over 72 hours (Admin only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of vendors with expired SLAs',
    type: [ExpiredSlaVendorDto]
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getExpiredSLAs(): Promise<ExpiredSlaVendorDto[]> {
    return this.analyticsService.getVendorsWithExpiredSLAs();
  }
}
