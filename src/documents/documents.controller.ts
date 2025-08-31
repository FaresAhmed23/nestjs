import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('documents')
@ApiBearerAuth('JWT-auth')
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new document' })
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    createDocumentDto.uploadedBy = req.user.userId;
    return this.documentsService.create(createDocumentDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get documents by project' })
  findByProject(@Param('projectId') projectId: string) {
    return this.documentsService.findByProject(projectId);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search documents' })
  search(@Body() searchDto: SearchDocumentDto) {
    return this.documentsService.search(searchDto);
  }
}
