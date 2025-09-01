// src/database/seeds/seed-documents.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DocumentsService } from '../../documents/documents.service';

async function seedDocuments() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const documentsService = app.get(DocumentsService);

    const documents = [
      {
        projectId: '20fb0a5c-aba6-444e-a9f4-d856211b1c7a',
        title: 'USA Market Entry Report',
        content:
          'Comprehensive analysis of the US market for software companies...',
        tags: ['usa', 'market-research', 'software', 'legal-requirements'],
        uploadedBy: 'admin@expanders360.com',
      },
      {
        projectId: 'a1342f0b-f41e-4ef5-bf72-f7fbb7e13f17',
        title: 'US Employment Law Guide',
        content:
          'Complete guide to employment law and regulations in the United States...',
        tags: ['usa', 'legal', 'employment', 'hr'],
        uploadedBy: 'admin@expanders360.com',
      },
    ];

    for (const doc of documents) {
      await documentsService.create(doc);
      console.log(`Created document: ${doc.title}`);
    }

    console.log('Document seeding completed!');
  } catch (error) {
    console.error('Error seeding documents:', error);
  } finally {
    await app.close();
  }
}

seedDocuments();
