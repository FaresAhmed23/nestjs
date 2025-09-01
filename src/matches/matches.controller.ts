// src/matches/matches.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  MatchWithVendorDto,
  RebuildMatchesResponseDto,
} from './dto/match-response.dto';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Matches')
@ApiBearerAuth('JWT-auth')
@Controller('projects/:projectId/matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('rebuild')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rebuild matches for a project',
    description:
      'Recalculate and update all vendor matches for a specific project. Clients can only rebuild their own projects, admins can rebuild any project.',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Matches rebuilt successfully',
    type: RebuildMatchesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async rebuildMatches(
    @Param('projectId') projectId: string,
    @Request() req,
  ): Promise<RebuildMatchesResponseDto> {
    const userEmail =
      req.user.role === UserRole.CLIENT ? req.user.email : undefined;
    const matches = await this.matchesService.rebuildMatches(
      projectId,
      userEmail,
    );
    return {
      count: matches.length,
      matches,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all matches for a project',
    description: 'Get all vendor matches for a project, sorted by score',
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of matches',
    type: [MatchWithVendorDto],
  })
  getMatches(
    @Param('projectId') projectId: string,
  ): Promise<MatchWithVendorDto[]> {
    return this.matchesService.getMatchesForProject(projectId);
  }
}
