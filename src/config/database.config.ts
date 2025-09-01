import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMySQLConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined,
});

export const getMongoDBConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_URI,
});
