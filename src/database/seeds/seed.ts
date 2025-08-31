import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMySQLConfig } from '../../config/database.config';
import { seedMySQL } from './mysql-seed';
import { seedMongoDB } from './mongodb-seed';
import * as mongoose from 'mongoose';
import { ResearchDocumentSchema } from '../../documents/schemas/document.schema';

async function runSeeds() {
  // Load environment variables
  ConfigModule.forRoot();

  // MySQL seeding
  const dataSource = new DataSource(getMySQLConfig() as any);
  await dataSource.initialize();
  
  try {
    await seedMySQL(dataSource);
  } catch (error) {
    console.error('MySQL seed error:', error);
  } finally {
    await dataSource.destroy();
  }

  // MongoDB seeding
  await mongoose.connect(process.env.MONGODB_URI);
  const DocumentModel = mongoose.model('ResearchDocument', ResearchDocumentSchema);
  
  try {
    await seedMongoDB(DocumentModel);
  } catch (error) {
    console.error('MongoDB seed error:', error);
  } finally {
    await mongoose.disconnect();
  }

  console.log('All seeds completed!');
  process.exit(0);
}

runSeeds();
