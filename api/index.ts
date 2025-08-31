import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Expanders360 API')
    .setDescription('Global Expansion Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  
  const server = app.getHttpAdapter().getInstance();
  return new Promise((resolve, reject) => {
    server(req, res, (err: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}
