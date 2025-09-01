// src/database/seeds/seed-documents.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DocumentsService } from '../../documents/documents.service';
import { ProjectsService } from '../../projects/projects.service';

async function seedDocuments() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const documentsService = app.get(DocumentsService);
    const projectsService = app.get(ProjectsService);

    // Get first project to use its ID
    const projects = await projectsService.findAll();

    if (projects.length === 0) {
      console.log('No projects found. Please create projects first.');
      return;
    }

    const projectId = projects[0].id;
    console.log(`Using project ID: ${projectId}`);

    const documents = [
      {
        projectId,
        title: 'USA Market Entry Report',
        content:
          'Comprehensive analysis of the US market for software companies. This report covers market size, competitive landscape, regulatory requirements, and entry strategies.',
        tags: ['usa', 'market-research', 'software', 'legal-requirements'],
        uploadedBy: 'admin@expanders360.com',
      },
      {
        projectId,
        title: 'US Employment Law Guide',
        content:
          'Complete guide to employment law and regulations in the United States. Covers hiring practices, compensation requirements, benefits, and termination procedures.',
        tags: ['usa', 'legal', 'employment', 'hr'],
        uploadedBy: 'admin@expanders360.com',
      },
      {
        projectId,
        title: 'Tax Structure Overview',
        content:
          'Overview of US tax system for foreign companies. Includes federal and state tax obligations, filing requirements, and tax optimization strategies.',
        tags: ['usa', 'tax', 'accounting', 'compliance'],
        uploadedBy: 'admin@expanders360.com',
      },
    ];

    for (const doc of documents) {
      try {
        await documentsService.create(doc);
        console.log(`Created document: ${doc.title}`);
      } catch (error) {
        console.log(`Document might already exist: ${doc.title}`);
      }
    }

    console.log('Document seeding completed!');
  } catch (error) {
    console.error('Error seeding documents:', error);
  } finally {
    await app.close();
  }
}

seedDocuments();
