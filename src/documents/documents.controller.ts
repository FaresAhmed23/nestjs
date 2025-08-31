import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import { DocumentResponseDto, DocumentSearchResultDto } from './dto/document-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth('JWT-auth')
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Upload a new document',
    description: 'Create a new research document in MongoDB'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Document created successfully',
    type: DocumentResponseDto
  })
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req): Promise<DocumentResponseDto> {
    createDocumentDto.uploadedBy = req.user.email;
    return this.documentsService.create(createDocumentDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ 
    summary: 'Get documents by project',
    description: 'Get all research documents for a specific project'
  })
  @ApiParam({ name: 'projectId', description: 'Project UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of documents',
    type: [DocumentResponseDto]
  })
  findByProject(@Param('projectId') projectId: string): Promise<DocumentResponseDto[]> {
    return this.documentsService.findByProject(projectId);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Search documents',
    description: 'Search documents by tags, text, or project ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results',
    type: DocumentSearchResultDto
  })
  async search(@Body() searchDto: SearchDocumentDto): Promise<DocumentSearchResultDto> {
    const documents = await this.documentsService.search(searchDto);
    return {
      documents,
      total: documents.length
    };
  }
}
