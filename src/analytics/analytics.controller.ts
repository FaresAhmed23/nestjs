import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopVendorsResponseDto, ExpiredSlaVendorDto } from './dto/analytics-response.dto';

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
  @ApiResponse({ 
    status: 200, 
    description: 'Top vendors analytics data',
    type: TopVendorsResponseDto
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  getTopVendors(): Promise<TopVendorsResponseDto> {
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
