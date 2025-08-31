import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDocument, ResearchDocumentDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocumentDocument>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<ResearchDocument> {
    const createdDocument = new this.documentModel(createDocumentDto);
    return createdDocument.save();
  }

  async findByProject(projectId: string): Promise<ResearchDocument[]> {
    return this.documentModel.find({ projectId }).exec();
  }

  async search(searchDto: SearchDocumentDto): Promise<ResearchDocument[]> {
    const query: any = {};

    if (searchDto.projectId) {
      query.projectId = searchDto.projectId;
    }

    if (searchDto.tags && searchDto.tags.length > 0) {
      query.tags = { $in: searchDto.tags };
    }

    if (searchDto.text) {
      query.$text = { $search: searchDto.text };
    }

    return this.documentModel.find(query).exec();
  }

  async countByProject(projectId: string): Promise<number> {
    return this.documentModel.countDocuments({ projectId }).exec();
  }

  async countByCountry(country: string): Promise<number> {
    // This requires joining with projects data
    // For now, we'll use a tag-based approach
    return this.documentModel.countDocuments({ 
      tags: { $in: [country.toLowerCase()] } 
    }).exec();
  }

  async getDocumentsByProjectIds(projectIds: string[]): Promise<Map<string, number>> {
    const results = await this.documentModel.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } }
    ]).exec();

    const countMap = new Map<string, number>();
    results.forEach(result => {
      countMap.set(result._id, result.count);
    });

    return countMap;
  }
}
