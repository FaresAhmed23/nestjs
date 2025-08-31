import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('matches')
@ApiBearerAuth('JWT-auth')
@Controller('projects/:projectId/matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('rebuild')
  @ApiOperation({ summary: 'Rebuild matches for a project' })
  rebuildMatches(@Param('projectId') projectId: string) {
    return this.matchesService.rebuildMatches(projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches for a project' })
  getMatches(@Param('projectId') projectId: string) {
    return this.matchesService.getMatchesForProject(projectId);
  }
}
