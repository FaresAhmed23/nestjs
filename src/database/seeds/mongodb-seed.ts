import { Model } from 'mongoose';

export async function seedMongoDB(documentModel: Model<any>) {
  console.log('Starting MongoDB seed...');

  const documents = [
    {
      projectId: '1',
      title: 'USA Market Entry Report',
      content:
        'Comprehensive analysis of the US market for software companies...',
      tags: ['usa', 'market-research', 'software', 'legal-requirements'],
      uploadedBy: 'admin',
    },
    {
      projectId: '1',
      title: 'US Employment Law Guide',
      content:
        'Complete guide to employment law and regulations in the United States...',
      tags: ['usa', 'legal', 'employment', 'hr'],
      uploadedBy: 'admin',
    },
    {
      projectId: '2',
      title: 'German Business Registration Process',
      content:
        'Step-by-step guide for registering a business entity in Germany...',
      tags: ['germany', 'legal', 'registration', 'compliance'],
      uploadedBy: 'admin',
    },
    {
      projectId: '3',
      title: 'Japanese Business Culture Guide',
      content:
        'Understanding Japanese business etiquette and cultural considerations...',
      tags: ['japan', 'culture', 'business-etiquette', 'hr'],
      uploadedBy: 'admin',
    },
    {
      projectId: '4',
      title: 'Brazil Tax Structure Overview',
      content:
        'Comprehensive overview of Brazilian tax system for foreign companies...',
      tags: ['brazil', 'tax', 'accounting', 'compliance'],
      uploadedBy: 'admin',
    },
  ];

  await documentModel.insertMany(documents);

  console.log('MongoDB seed completed!');
}
