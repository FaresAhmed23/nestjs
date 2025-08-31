import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth('JWT-auth')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get top vendors per country with document counts' })
  getTopVendors() {
    return this.analyticsService.getTopVendorsPerCountry();
  }

  @Get('expired-slas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get vendors with expired SLAs' })
  getExpiredSLAs() {
    return this.analyticsService.getVendorsWithExpiredSLAs();
  }
}
