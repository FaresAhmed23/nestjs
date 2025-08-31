const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { AppModule } = require('../dist/app.module');

module.exports = async (req, res) => {
  try {
    const app = await NestFactory.create(AppModule, { logger: false });
    
    const config = new DocumentBuilder()
      .setTitle('Expanders360 API')
      .setDescription('Global Expansion Management API')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }, 'JWT-auth')
      .addTag('Authentication', 'User registration and login')
      .addTag('Projects', 'Manage expansion projects')
      .addTag('Vendors', 'Manage service vendors')
      .addTag('Matches', 'Project-vendor matching')
      .addTag('Documents', 'Research documents (MongoDB)')
      .addTag('Analytics', 'Analytics and reporting')
      .addServer('https://expanders360-inky.vercel.app', 'Production')
      .addServer('http://localhost:3000', 'Development')
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(document);
  } catch (error) {
    console.error('Swagger JSON error:', error);
    res.status(500).json({ error: 'Failed to generate Swagger documentation' });
  }
};
